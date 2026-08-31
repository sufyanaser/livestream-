import { contextBridge, ipcRenderer } from 'electron'
import { OBS_CHANNELS, type ObsBridge, type ObsConnectionConfig, type ObsState } from '../shared/obs'
import { PROJECT_CHANNELS, type ProjectBridge, type ProjectDocument } from '../shared/project'
import { GRAPHICS_CHANNELS, type GraphicsBridge, type GraphicsPatch, type GraphicsState } from '../shared/graphics'
import { REMOTE_CHANNELS, type RemoteBridge, type RemoteState } from '../shared/remote'

contextBridge.exposeInMainWorld('nasBroadcast', {
  platform: process.platform,
  runtime: 'electron',
  project: {
    get: () => ipcRenderer.invoke(PROJECT_CHANNELS.get) as Promise<ProjectDocument>,
    save: (project: ProjectDocument) => ipcRenderer.invoke(PROJECT_CHANNELS.save, project) as Promise<ProjectDocument>,
    importProject: () => ipcRenderer.invoke(PROJECT_CHANNELS.import) as Promise<ProjectDocument | null>,
    exportProject: (project: ProjectDocument) => ipcRenderer.invoke(PROJECT_CHANNELS.export, project) as Promise<string | null>,
    onChanged: (listener: (project: ProjectDocument) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, project: ProjectDocument): void => listener(project)
      ipcRenderer.on(PROJECT_CHANNELS.changed, handler)
      return () => ipcRenderer.removeListener(PROJECT_CHANNELS.changed, handler)
    }
  } satisfies ProjectBridge,
  graphics: {
    get: () => ipcRenderer.invoke(GRAPHICS_CHANNELS.get) as Promise<GraphicsState>,
    update: (patch: GraphicsPatch) => ipcRenderer.invoke(GRAPHICS_CHANNELS.update, patch) as Promise<GraphicsState>,
    onChanged: (listener: (state: GraphicsState) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, state: GraphicsState): void => listener(state)
      ipcRenderer.on(GRAPHICS_CHANNELS.changed, handler)
      return () => ipcRenderer.removeListener(GRAPHICS_CHANNELS.changed, handler)
    }
  } satisfies GraphicsBridge,
  remote: {
    get: () => ipcRenderer.invoke(REMOTE_CHANNELS.get) as Promise<RemoteState>,
    enable: () => ipcRenderer.invoke(REMOTE_CHANNELS.enable) as Promise<RemoteState>,
    disable: () => ipcRenderer.invoke(REMOTE_CHANNELS.disable) as Promise<RemoteState>,
    onChanged: (listener: (state: RemoteState) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, state: RemoteState): void => listener(state)
      ipcRenderer.on(REMOTE_CHANNELS.changed, handler)
      return () => ipcRenderer.removeListener(REMOTE_CHANNELS.changed, handler)
    }
  } satisfies RemoteBridge,
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
