import { BrowserWindow, dialog, ipcMain } from 'electron'
import { readFile, writeFile } from 'node:fs/promises'
import { PROJECT_CHANNELS, type ProjectDocument } from '../../shared/project'
import { isProjectDocument, type ProjectRepository } from './project-repository'

const publish = (project: ProjectDocument): void => {
  for (const window of BrowserWindow.getAllWindows()) if (!window.isDestroyed()) window.webContents.send(PROJECT_CHANNELS.changed, project)
}

export function registerProjectIpc(repository: ProjectRepository): void {
  ipcMain.handle(PROJECT_CHANNELS.get, () => repository.get())
  ipcMain.handle(PROJECT_CHANNELS.save, async (_event, project: ProjectDocument) => {
    const saved = await repository.save(project)
    publish(saved)
    return saved
  })
  ipcMain.handle(PROJECT_CHANNELS.export, async (_event, project: ProjectDocument) => {
    if (!isProjectDocument(project)) throw new Error('Invalid project document')
    const result = await dialog.showSaveDialog({ title: 'Export NAS Broadcast project', defaultPath: `${project.name.replace(/[^a-z0-9-_ ]/gi, '').trim() || 'broadcast-project'}.nasbroadcast`, filters: [{ name: 'NAS Broadcast Project', extensions: ['nasbroadcast'] }] })
    if (result.canceled || !result.filePath) return null
    await writeFile(result.filePath, JSON.stringify(project, null, 2), 'utf8')
    return result.filePath
  })
  ipcMain.handle(PROJECT_CHANNELS.import, async () => {
    const result = await dialog.showOpenDialog({ title: 'Import NAS Broadcast project', properties: ['openFile'], filters: [{ name: 'NAS Broadcast Project', extensions: ['nasbroadcast', 'json'] }] })
    if (result.canceled || !result.filePaths[0]) return null
    const parsed: unknown = JSON.parse(await readFile(result.filePaths[0], 'utf8'))
    if (!isProjectDocument(parsed)) throw new Error('The selected file is not a supported NAS Broadcast project')
    const saved = await repository.save(parsed)
    publish(saved)
    return saved
  })
}

export function unregisterProjectIpc(): void {
  ipcMain.removeHandler(PROJECT_CHANNELS.get)
  ipcMain.removeHandler(PROJECT_CHANNELS.save)
  ipcMain.removeHandler(PROJECT_CHANNELS.import)
  ipcMain.removeHandler(PROJECT_CHANNELS.export)
}
