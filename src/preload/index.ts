import { contextBridge, ipcRenderer } from 'electron'
import { OBS_CHANNELS, type ObsBridge, type ObsConnectionConfig, type ObsState } from '../shared/obs'

contextBridge.exposeInMainWorld('nasBroadcast', {
  platform: process.platform,
  runtime: 'electron',
  obs: {
    getState: () => ipcRenderer.invoke(OBS_CHANNELS.getState) as Promise<ObsState>,
    connect: (config: ObsConnectionConfig) => ipcRenderer.invoke(OBS_CHANNELS.connect, config) as Promise<ObsState>,
    disconnect: () => ipcRenderer.invoke(OBS_CHANNELS.disconnect) as Promise<ObsState>,
    refresh: () => ipcRenderer.invoke(OBS_CHANNELS.refresh) as Promise<ObsState>,
    onStateChanged: (listener: (state: ObsState) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, state: ObsState): void => listener(state)
      ipcRenderer.on(OBS_CHANNELS.stateChanged, handler)
      return () => ipcRenderer.removeListener(OBS_CHANNELS.stateChanged, handler)
    }
  } satisfies ObsBridge
})
