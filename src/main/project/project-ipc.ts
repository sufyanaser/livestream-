import { BrowserWindow, ipcMain } from 'electron'
import { PROJECT_CHANNELS, type ProjectDocument } from '../../shared/project'
import type { ProjectRepository } from './project-repository'

export function registerProjectIpc(repository: ProjectRepository): void {
  ipcMain.handle(PROJECT_CHANNELS.get, () => repository.get())
  ipcMain.handle(PROJECT_CHANNELS.save, async (_event, project: ProjectDocument) => {
    const saved = await repository.save(project)
    for (const window of BrowserWindow.getAllWindows()) {
      if (!window.isDestroyed()) window.webContents.send(PROJECT_CHANNELS.changed, saved)
    }
    return saved
  })
}

export function unregisterProjectIpc(): void {
  ipcMain.removeHandler(PROJECT_CHANNELS.get)
  ipcMain.removeHandler(PROJECT_CHANNELS.save)
}
