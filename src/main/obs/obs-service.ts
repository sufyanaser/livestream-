import OBSWebSocket from 'obs-websocket-js'
import type { ObsConnectionConfig, ObsInputSummary, ObsSceneSummary, ObsState } from '../../shared/obs'

const DEFAULT_ENDPOINT = 'ws://127.0.0.1:4455'
const MAX_RECONNECT_DELAY_MS = 10_000

type StatePublisher = (state: ObsState) => void
type UnknownRecord = Record<string, unknown>

const initialState = (): ObsState => ({
  status: 'disconnected',
  endpoint: DEFAULT_ENDPOINT,
  error: null,
  obsWebSocketVersion: null,
  negotiatedRpcVersion: null,
  reconnectAttempt: 0,
  currentProgramSceneName: null,
  currentPreviewSceneName: null,
  scenes: [],
  inputs: []
})

const readString = (value: unknown): string | null => (typeof value === 'string' ? value : null)

const toSceneSummary = (value: UnknownRecord): ObsSceneSummary | null => {
  const name = readString(value.sceneName)
  if (!name) return null
  return { name, uuid: readString(value.sceneUuid) }
}

const toInputSummary = (value: UnknownRecord): ObsInputSummary | null => {
  const name = readString(value.inputName)
  if (!name) return null
  return {
    name,
    uuid: readString(value.inputUuid),
    kind: readString(value.inputKind) ?? 'unknown'
  }
}

const asRecordArray = (value: unknown): UnknownRecord[] => {
  if (!Array.isArray(value)) return []
  return value.filter((entry): entry is UnknownRecord => typeof entry === 'object' && entry !== null)
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message.trim()) return error.message
  return 'Unable to connect to OBS WebSocket'
}

const normalizeEndpoint = (endpoint: string): string => {
  const candidate = endpoint.trim() || DEFAULT_ENDPOINT
  const parsed = new URL(candidate)
  if (parsed.protocol !== 'ws:' && parsed.protocol !== 'wss:') {
    throw new Error('OBS endpoint must use ws:// or wss://')
  }
  if (parsed.username || parsed.password) throw new Error('Credentials are not allowed in the OBS endpoint URL')
  return parsed.toString().replace(/\/$/, '')
}

export class ObsService {
  readonly #client = new OBSWebSocket()
  readonly #publish: StatePublisher
  #state = initialState()
  #config: ObsConnectionConfig | null = null
  #manualDisconnect = true
  #reconnectTimer: ReturnType<typeof setTimeout> | null = null
  #connectGeneration = 0

  constructor(publish: StatePublisher) {
    this.#publish = publish
    this.#bindEvents()
  }

  getState(): ObsState {
    return structuredClone(this.#state)
  }

  async connect(config: ObsConnectionConfig): Promise<ObsState> {
    const normalizedConfig = { endpoint: normalizeEndpoint(config.endpoint), password: config.password }
    const isReconnect = this.#state.status === 'reconnecting'
    this.#manualDisconnect = false
    this.#config = normalizedConfig
    this.#clearReconnectTimer()
    const generation = ++this.#connectGeneration

    if (this.#client.identified) {
      this.#manualDisconnect = true
      await this.#client.disconnect()
      this.#manualDisconnect = false
    }
    this.#patchState({
      status: isReconnect ? 'reconnecting' : 'connecting',
      endpoint: normalizedConfig.endpoint,
      error: null,
      reconnectAttempt: isReconnect ? this.#state.reconnectAttempt : 0
    })

    try {
      const identified = await this.#client.connect(normalizedConfig.endpoint, normalizedConfig.password)
      if (generation !== this.#connectGeneration) return this.getState()
      this.#patchState({
        status: 'connected',
        error: null,
        obsWebSocketVersion: identified.obsWebSocketVersion,
        negotiatedRpcVersion: identified.negotiatedRpcVersion,
        reconnectAttempt: 0
      })
      await this.refresh()
    } catch (error) {
      if (generation !== this.#connectGeneration) return this.getState()
      this.#patchState({ status: 'error', error: getErrorMessage(error) })
      this.#scheduleReconnect()
    }

    return this.getState()
  }

  async disconnect(): Promise<ObsState> {
    this.#manualDisconnect = true
    this.#config = null
    this.#connectGeneration += 1
    this.#clearReconnectTimer()
    if (this.#client.identified) await this.#client.disconnect()
    this.#state = initialState()
    this.#publish(this.getState())
    return this.getState()
  }

  async refresh(): Promise<ObsState> {
    if (!this.#client.identified) return this.getState()

    try {
      const [sceneResponse, inputResponse] = await Promise.all([
        this.#client.call('GetSceneList'),
        this.#client.call('GetInputList')
      ])
      this.#patchState({
        currentProgramSceneName: readString(sceneResponse.currentProgramSceneName),
        currentPreviewSceneName: readString(sceneResponse.currentPreviewSceneName),
        scenes: asRecordArray(sceneResponse.scenes).map(toSceneSummary).filter((scene): scene is ObsSceneSummary => scene !== null),
        inputs: asRecordArray(inputResponse.inputs).map(toInputSummary).filter((input): input is ObsInputSummary => input !== null),
        error: null
      })
    } catch (error) {
      this.#patchState({ error: getErrorMessage(error) })
    }
    return this.getState()
  }

  async dispose(): Promise<void> {
    this.#manualDisconnect = true
    this.#clearReconnectTimer()
    if (this.#client.identified) await this.#client.disconnect()
    this.#client.removeAllListeners()
  }

  #bindEvents(): void {
    this.#client.on('ConnectionClosed', (error) => {
      if (this.#manualDisconnect) return
      this.#patchState({ status: 'reconnecting', error: getErrorMessage(error) })
      this.#scheduleReconnect()
    })

    this.#client.on('CurrentProgramSceneChanged', ({ sceneName }) => {
      this.#patchState({ currentProgramSceneName: sceneName })
    })

    this.#client.on('CurrentPreviewSceneChanged', ({ sceneName }) => {
      this.#patchState({ currentPreviewSceneName: sceneName })
    })

    const refresh = (): void => void this.refresh()
    this.#client.on('SceneListChanged', refresh)
    this.#client.on('InputCreated', refresh)
    this.#client.on('InputRemoved', refresh)
    this.#client.on('InputNameChanged', refresh)
  }

  #scheduleReconnect(): void {
    if (this.#manualDisconnect || !this.#config || this.#reconnectTimer) return
    const attempt = this.#state.reconnectAttempt + 1
    const delay = Math.min(1000 * 2 ** (attempt - 1), MAX_RECONNECT_DELAY_MS)
    this.#patchState({ status: 'reconnecting', reconnectAttempt: attempt })
    this.#reconnectTimer = setTimeout(() => {
      this.#reconnectTimer = null
      const config = this.#config
      if (config) void this.connect(config)
    }, delay)
  }

  #clearReconnectTimer(): void {
    if (!this.#reconnectTimer) return
    clearTimeout(this.#reconnectTimer)
    this.#reconnectTimer = null
  }

  #patchState(patch: Partial<ObsState>): void {
    this.#state = { ...this.#state, ...patch }
    this.#publish(this.getState())
  }
}
