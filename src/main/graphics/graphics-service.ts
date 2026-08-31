import { createServer, type Server, type ServerResponse } from 'node:http'
import type { GraphicsPatch, GraphicsState } from '../../shared/graphics'
import { overlayDocument } from './overlay-document'

type Publisher = (state: GraphicsState) => void

const initialState = (): GraphicsState => ({
  endpoint: '', revision: 0,
  lowerThird: { visible: false, name: 'Guest Name', title: 'Title', organization: 'Organization', accentColor: '#38bdf8', direction: 'rtl', autoHideSeconds: 8 },
  ticker: { visible: false, text: 'Welcome to the Anbar International Fair', direction: 'rtl', speed: 18 },
  clock: { visible: false, mode: 'clock', targetTime: null },
  logoVisible: false, sponsorVisible: false
})

export class GraphicsService {
  readonly #publish: Publisher
  readonly #clients = new Set<ServerResponse>()
  #server: Server | null = null
  #state = initialState()
  #autoHideTimer: ReturnType<typeof setTimeout> | null = null

  constructor(publish: Publisher) { this.#publish = publish }

  async start(): Promise<GraphicsState> {
    for (let port = 4456; port <= 4466; port += 1) {
      try {
        await this.#listen(port)
        this.#state.endpoint = `http://127.0.0.1:${port}/overlay`
        return this.get()
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EADDRINUSE') throw error
      }
    }
    throw new Error('No local port is available for the graphics engine')
  }

  get(): GraphicsState { return structuredClone(this.#state) }

  update(patch: GraphicsPatch): GraphicsState {
    this.#state = {
      ...this.#state,
      ...patch,
      endpoint: this.#state.endpoint,
      revision: this.#state.revision + 1,
      lowerThird: { ...this.#state.lowerThird, ...patch.lowerThird },
      ticker: { ...this.#state.ticker, ...patch.ticker },
      clock: { ...this.#state.clock, ...patch.clock }
    }
    this.#scheduleAutoHide()
    this.#broadcast()
    return this.get()
  }

  async stop(): Promise<void> {
    if (this.#autoHideTimer) clearTimeout(this.#autoHideTimer)
    for (const client of this.#clients) client.end()
    this.#clients.clear()
    if (this.#server) await new Promise<void>((resolve, reject) => this.#server?.close((error) => error ? reject(error) : resolve()))
    this.#server = null
  }

  #listen(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = createServer((request, response) => this.#handleRequest(request.url ?? '/', response))
      server.once('error', reject)
      server.listen(port, '127.0.0.1', () => { server.removeListener('error', reject); this.#server = server; resolve() })
    })
  }

  #handleRequest(url: string, response: ServerResponse): void {
    response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1')
    response.setHeader('X-Content-Type-Options', 'nosniff')
    if (url === '/overlay') { response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); response.end(overlayDocument); return }
    if (url === '/state') { response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); response.end(JSON.stringify(this.#state)); return }
    if (url === '/events') { response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' }); response.write(`data: ${JSON.stringify(this.#state)}\n\n`); this.#clients.add(response); response.on('close', () => this.#clients.delete(response)); return }
    response.writeHead(404).end()
  }

  #broadcast(): void {
    const state = this.get()
    const event = `data: ${JSON.stringify(state)}\n\n`
    for (const client of this.#clients) client.write(event)
    this.#publish(state)
  }

  #scheduleAutoHide(): void {
    if (this.#autoHideTimer) clearTimeout(this.#autoHideTimer)
    const { visible, autoHideSeconds } = this.#state.lowerThird
    if (!visible || !autoHideSeconds) return
    this.#autoHideTimer = setTimeout(() => this.update({ lowerThird: { visible: false } }), autoHideSeconds * 1000)
  }
}

