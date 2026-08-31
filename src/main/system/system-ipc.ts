import { clipboard, ipcMain } from 'electron'

const COPY_TEXT_CHANNEL = 'system:copy-text'
export function registerSystemIpc(): void { ipcMain.on(COPY_TEXT_CHANNEL, (_event, value: string) => { if (typeof value === 'string' && value.length <= 4096) void clipboard.writeText(value) }) }
export function unregisterSystemIpc(): void { ipcMain.removeAllListeners(COPY_TEXT_CHANNEL) }
