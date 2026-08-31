import { app, BrowserWindow, crashReporter, session, shell } from 'electron'
import { join } from 'node:path'
import { obsService, registerObsIpc, unregisterObsIpc } from './obs/obs-ipc'
import { registerProjectIpc, unregisterProjectIpc } from './project/project-ipc'
import { ProjectRepository } from './project/project-repository'
import { graphicsService, registerGraphicsIpc, unregisterGraphicsIpc } from './graphics/graphics-ipc'
import { registerRemoteIpc, remotePublisher, unregisterRemoteIpc } from './remote/remote-ipc'
import { RemoteService } from './remote/remote-service'
import { appLogger } from './observability/app-logger'
import { initializeUpdater } from './updater/update-service'
import { registerSystemIpc, unregisterSystemIpc } from './system/system-ipc'

let remoteService: RemoteService | null = null
let rendererRecoveryAttempts = 0

const hasSingleInstanceLock = app.requestSingleInstanceLock()
if (!hasSingleInstanceLock) app.quit()
app.on('second-instance', () => {
  const window = BrowserWindow.getAllWindows()[0]
  if (window) { if (window.isMinimized()) window.restore(); window.focus() }
})

const createWindow = (): void => {
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1180,
    minHeight: 760,
    show: false,
    backgroundColor: '#07090d',
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'hidden',
    titleBarOverlay: process.platform === 'win32' ? { color: '#0b0e13', symbolColor: '#a1a1aa', height: 40 } : undefined,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: true,
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  mainWindow.once('ready-to-show', () => mainWindow.show())

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) void shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.webContents.on('will-navigate', (event) => event.preventDefault())
  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    appLogger.error('renderer.gone', { reason: details.reason, exitCode: details.exitCode })
    if (rendererRecoveryAttempts >= 2 || mainWindow.isDestroyed()) return
    rendererRecoveryAttempts += 1
    setTimeout(() => { if (!mainWindow.isDestroyed()) mainWindow.reload() }, 750)
  })
  mainWindow.webContents.on('did-finish-load', () => { rendererRecoveryAttempts = 0 })

  if (process.env.ELECTRON_RENDERER_URL) {
    void mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    void mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

void app.whenReady().then(async () => {
  crashReporter.start({ uploadToServer: false })
  app.setAppUserModelId('com.nas.broadcast-director')
  await appLogger.initialize(app.getPath('userData'))
  appLogger.info('app.ready', { version: app.getVersion(), platform: process.platform })
  session.defaultSession.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false))
  registerObsIpc()
  registerSystemIpc()
  await graphicsService.start()
  registerGraphicsIpc()
  const projectRepository = new ProjectRepository(app.getPath('userData'))
  await projectRepository.initialize()
  registerProjectIpc(projectRepository)
  remoteService = new RemoteService(projectRepository, graphicsService, remotePublisher)
  registerRemoteIpc(remoteService)
  initializeUpdater()
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  unregisterObsIpc()
  unregisterSystemIpc()
  unregisterProjectIpc()
  unregisterGraphicsIpc()
  unregisterRemoteIpc()
  void obsService.dispose()
  void graphicsService.stop()
  if (remoteService) void remoteService.disable()
})
