export const OBS_CHANNELS = {
  connect: 'obs:connect',
  disconnect: 'obs:disconnect',
  getState: 'obs:get-state',
  refresh: 'obs:refresh',
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
}

export interface ObsBridge {
  getState: () => Promise<ObsState>
  connect: (config: ObsConnectionConfig) => Promise<ObsState>
  disconnect: () => Promise<ObsState>
  refresh: () => Promise<ObsState>
  onStateChanged: (listener: (state: ObsState) => void) => () => void
}

