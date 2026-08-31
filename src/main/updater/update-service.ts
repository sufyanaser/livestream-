import { app } from 'electron'
import electronUpdater from 'electron-updater'
import { appLogger } from '../observability/app-logger'

// electron-updater is published as CommonJS. Its named exports work during
// type-checking but fail when Electron loads the externalized package as ESM.
const { autoUpdater } = electronUpdater

export function initializeUpdater(): void {
  if (!app.isPackaged) return
  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.on('update-available', (info) => appLogger.info('updater.available', { version: info.version }))
  autoUpdater.on('update-not-available', () => appLogger.info('updater.current'))
  autoUpdater.on('error', (error) => appLogger.error('updater.error', { message: error.message }))
  setTimeout(() => void autoUpdater.checkForUpdates().catch((error: unknown) => appLogger.warn('updater.check_failed', { message: error instanceof Error ? error.message : 'Unknown updater error' })), 15_000)
}
