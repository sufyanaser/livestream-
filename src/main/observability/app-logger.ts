import { appendFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

type LogLevel = 'info' | 'warn' | 'error'

export class AppLogger {
  #filePath = ''
  #queue: Promise<void> = Promise.resolve()

  async initialize(userDataPath: string): Promise<void> {
    this.#filePath = join(userDataPath, 'logs', 'broadcast-director.log')
    await mkdir(dirname(this.#filePath), { recursive: true })
    const size = await stat(this.#filePath).then((value) => value.size).catch(() => 0)
    if (size > 2_000_000) {
      const content = await readFile(this.#filePath, 'utf8')
      await writeFile(this.#filePath, content.slice(-500_000), 'utf8')
    }
  }

  info(event: string, details?: Record<string, unknown>): void { this.#write('info', event, details) }
  warn(event: string, details?: Record<string, unknown>): void { this.#write('warn', event, details) }
  error(event: string, details?: Record<string, unknown>): void { this.#write('error', event, details) }

  #write(level: LogLevel, event: string, details?: Record<string, unknown>): void {
    if (!this.#filePath) return
    const safeDetails = details ? Object.fromEntries(Object.entries(details).filter(([key]) => !/password|token|secret/i.test(key))) : undefined
    const line = `${JSON.stringify({ timestamp: new Date().toISOString(), level, event, details: safeDetails })}\n`
    this.#queue = this.#queue.then(() => appendFile(this.#filePath, line, 'utf8')).catch(() => undefined)
  }
}

export const appLogger = new AppLogger()

