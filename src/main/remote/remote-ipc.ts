import { BrowserWindow, ipcMain } from 'electron'
import { REMOTE_CHANNELS, type RemoteState } from '../../shared/remote'
import type { RemoteService } from './remote-service'

const publish = (state: RemoteState): void => { for (const window of BrowserWindow.getAllWindows()) if (!window.isDestroyed()) window.webContents.send(REMOTE_CHANNELS.changed, state) }
export const remotePublisher = publish
export function registerRemoteIpc(service: RemoteService): void { ipcMain.handle(REMOTE_CHANNELS.get, () => service.get()); ipcMain.handle(REMOTE_CHANNELS.enable, () => service.enable()); ipcMain.handle(REMOTE_CHANNELS.disable, () => service.disable()) }
export function unregisterRemoteIpc(): void { ipcMain.removeHandler(REMOTE_CHANNELS.get); ipcMain.removeHandler(REMOTE_CHANNELS.enable); ipcMain.removeHandler(REMOTE_CHANNELS.disable) }
