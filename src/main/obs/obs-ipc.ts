import { BrowserWindow, ipcMain } from 'electron'
import { OBS_CHANNELS, type ObsConnectionConfig, type ObsLayoutSource, type ObsState } from '../../shared/obs'
import { ObsService } from './obs-service'

const broadcastState = (state: ObsState): void => {
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed()) window.webContents.send(OBS_CHANNELS.stateChanged, state)
  }
}

export const obsService = new ObsService(broadcastState)

export function registerObsIpc(): void {
  ipcMain.handle(OBS_CHANNELS.getState, () => obsService.getState())
  ipcMain.handle(OBS_CHANNELS.connect, (_event, config: ObsConnectionConfig) => obsService.connect(config))
  ipcMain.handle(OBS_CHANNELS.disconnect, () => obsService.disconnect())
  ipcMain.handle(OBS_CHANNELS.refresh, () => obsService.refresh())
  ipcMain.handle(OBS_CHANNELS.selectScene, (_event, sceneName: string) => obsService.selectScene(sceneName))
  ipcMain.handle(OBS_CHANNELS.take, () => obsService.take())
  ipcMain.handle(OBS_CHANNELS.setTransition, (_event, name: string, duration: number) => obsService.setTransition(name, duration))
  ipcMain.handle(OBS_CHANNELS.ensureGraphics, (_event, endpoint: string) => obsService.ensureGraphics(endpoint))
  ipcMain.handle(OBS_CHANNELS.applyLayout, (_event, layoutName: string, sources: ObsLayoutSource[]) => obsService.applyLayout(layoutName, sources))
}

export function unregisterObsIpc(): void {
  for (const channel of [OBS_CHANNELS.getState, OBS_CHANNELS.connect, OBS_CHANNELS.disconnect, OBS_CHANNELS.refresh, OBS_CHANNELS.selectScene, OBS_CHANNELS.take, OBS_CHANNELS.setTransition, OBS_CHANNELS.ensureGraphics, OBS_CHANNELS.applyLayout]) {
    ipcMain.removeHandler(channel)
  }
}

