export const REMOTE_CHANNELS = { get: 'remote:get', enable: 'remote:enable', disable: 'remote:disable', changed: 'remote:changed' } as const
export type RemoteRole = 'director' | 'operator' | 'viewer'
export interface RemoteState { enabled: boolean; port: number; directorUrl: string | null; operatorUrl: string | null; viewerUrl: string | null; connectedClients: number }
export interface RemoteBridge { get: () => Promise<RemoteState>; enable: () => Promise<RemoteState>; disable: () => Promise<RemoteState>; onChanged: (listener: (state: RemoteState) => void) => () => void }

