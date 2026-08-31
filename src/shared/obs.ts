export const OBS_CHANNELS = {
  connect: 'obs:connect',
  disconnect: 'obs:disconnect',
  getState: 'obs:get-state',
  refresh: 'obs:refresh',
  selectScene: 'obs:select-scene',
  take: 'obs:take',
  setTransition: 'obs:set-transition',
  ensureGraphics: 'obs:ensure-graphics',
  applyLayout: 'obs:apply-layout',
  stateChanged: 'obs:state-changed'
} as const

export type ObsConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error'

export interface ObsConnectionConfig {
  endpoint: string
  password: string
}

export interface ObsSceneSummary {
  name: string
  uuid: string | null
}

export interface ObsInputSummary {
  name: string
  uuid: string | null
  kind: string
}

export interface ObsLayoutSource {
  inputName: string
  x: number
  y: number
  width: number
  height: number
}

export interface ObsState {
  status: ObsConnectionStatus
  endpoint: string
  error: string | null
  obsWebSocketVersion: string | null
  negotiatedRpcVersion: number | null
  reconnectAttempt: number
  currentProgramSceneName: string | null
  currentPreviewSceneName: string | null
  scenes: ObsSceneSummary[]
  inputs: ObsInputSummary[]
  studioModeEnabled: boolean
  streamActive: boolean
  recordActive: boolean
  currentTransitionName: string | null
  transitionDuration: number
}

export interface ObsBridge {
  getState: () => Promise<ObsState>
  connect: (config: ObsConnectionConfig) => Promise<ObsState>
  disconnect: () => Promise<ObsState>
  refresh: () => Promise<ObsState>
  selectScene: (sceneName: string) => Promise<ObsState>
  take: () => Promise<ObsState>
  setTransition: (name: string, duration: number) => Promise<ObsState>
  ensureGraphics: (endpoint: string) => Promise<ObsState>
  applyLayout: (layoutName: string, sources: ObsLayoutSource[]) => Promise<ObsState>
  onStateChanged: (listener: (state: ObsState) => void) => () => void
}

