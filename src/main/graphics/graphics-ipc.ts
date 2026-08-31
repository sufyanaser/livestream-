import { BrowserWindow, ipcMain } from 'electron'
import { GRAPHICS_CHANNELS, type GraphicsPatch, type GraphicsState } from '../../shared/graphics'
import { GraphicsService } from './graphics-service'

const publish = (state: GraphicsState): void => {
  for (const window of BrowserWindow.getAllWindows()) if (!window.isDestroyed()) window.webContents.send(GRAPHICS_CHANNELS.changed, state)
}

export const graphicsService = new GraphicsService(publish)

export function registerGraphicsIpc(): void {
  ipcMain.handle(GRAPHICS_CHANNELS.get, () => graphicsService.get())
  ipcMain.handle(GRAPHICS_CHANNELS.update, (_event, patch: GraphicsPatch) => graphicsService.update(patch))
}

export function unregisterGraphicsIpc(): void {
  ipcMain.removeHandler(GRAPHICS_CHANNELS.get)
  ipcMain.removeHandler(GRAPHICS_CHANNELS.update)
}
