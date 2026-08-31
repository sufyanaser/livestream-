import { BrowserWindow, ipcMain } from 'electron'
import { OBS_CHANNELS, type ObsConnectionConfig, type ObsState } from '../../shared/obs'
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
}

export function unregisterObsIpc(): void {
  for (const channel of [OBS_CHANNELS.getState, OBS_CHANNELS.connect, OBS_CHANNELS.disconnect, OBS_CHANNELS.refresh]) {
    ipcMain.removeHandler(channel)
  }
}

