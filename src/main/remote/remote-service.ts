import { randomBytes } from 'node:crypto'
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http'
import { networkInterfaces } from 'node:os'
import type { RemoteRole, RemoteState } from '../../shared/remote'
import type { GraphicsService } from '../graphics/graphics-service'
import type { ProjectRepository } from '../project/project-repository'
import { remoteDocument } from './remote-document'

type Publisher = (state: RemoteState) => void
const token = (): string => randomBytes(24).toString('base64url')

export class RemoteService {
  readonly #project: ProjectRepository
  readonly #graphics: GraphicsService
  readonly #publish: Publisher
  readonly #tokens: Record<RemoteRole, string> = { director: token(), operator: token(), viewer: token() }
  #server: Server | null = null
  #state: RemoteState = { enabled: false, port: 4457, directorUrl: null, operatorUrl: null, viewerUrl: null, connectedClients: 0 }

  constructor(project: ProjectRepository, graphics: GraphicsService, publish: Publisher) { this.#project = project; this.#graphics = graphics; this.#publish = publish }
  get(): RemoteState { return structuredClone(this.#state) }

  async enable(): Promise<RemoteState> {
    if (this.#server) return this.get()
    const address = this.#lanAddress()
    this.#server = createServer((request, response) => void this.#handle(request, response))
    await new Promise<void>((resolve, reject) => { this.#server?.once('error', reject); this.#server?.listen(this.#state.port, '0.0.0.0', () => resolve()) })
    const base = `http://${address}:${this.#state.port}/remote`
    this.#state = { ...this.#state, enabled: true, directorUrl: `${base}?token=${this.#tokens.director}`, operatorUrl: `${base}?token=${this.#tokens.operator}`, viewerUrl: `${base}?token=${this.#tokens.viewer}` }
    this.#publish(this.get())
    return this.get()
  }

  async disable(): Promise<RemoteState> {
    if (this.#server) await new Promise<void>((resolve) => this.#server?.close(() => resolve()))
    this.#server = null
    this.#state = { ...this.#state, enabled: false, directorUrl: null, operatorUrl: null, viewerUrl: null, connectedClients: 0 }
    this.#publish(this.get())
    return this.get()
  }

  async #handle(request: IncomingMessage, response: ServerResponse): Promise<void> {
    response.setHeader('X-Content-Type-Options', 'nosniff')
    response.setHeader('Cache-Control', 'no-store')
    const url = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`)
    if (url.pathname === '/remote') { response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); response.end(remoteDocument); return }
    const role = this.#roleFor(url.searchParams.get('token'))
    if (!role) { response.writeHead(401).end(); return }
    if (url.pathname === '/api/state' && request.method === 'GET') { const project = this.#project.get(); const active = project.rundown.find((item) => item.id === project.activeRundownItemId); response.writeHead(200, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ role, activeCue: active?.title ?? null })); return }
    if (url.pathname === '/api/action' && request.method === 'POST') { if (role === 'viewer') { response.writeHead(403).end(); return } const body = await this.#readBody(request); const action = typeof body.type === 'string' ? body.type : ''; await this.#runAction(action); response.writeHead(204).end(); return }
    response.writeHead(404).end()
  }

  async #runAction(action: string): Promise<void> {
    const graphics = this.#graphics.get()
    if (action === 'lower') this.#graphics.update({ lowerThird: { visible: !graphics.lowerThird.visible } })
    if (action === 'ticker') this.#graphics.update({ ticker: { visible: !graphics.ticker.visible } })
    if (action === 'clock') this.#graphics.update({ clock: { visible: !graphics.clock.visible } })
    if (action === 'logo') this.#graphics.update({ logoVisible: !graphics.logoVisible })
    if (action === 'next') { const project = this.#project.get(); const currentIndex = project.rundown.findIndex((item) => item.id === project.activeRundownItemId); const next = project.rundown[Math.min(currentIndex + 1, project.rundown.length - 1)]; if (next) await this.#project.save({ ...project, activeRundownItemId: next.id }) }
  }

  #roleFor(candidate: string | null): RemoteRole | null { return (Object.entries(this.#tokens).find(([, value]) => value === candidate)?.[0] as RemoteRole | undefined) ?? null }
  #lanAddress(): string { for (const entries of Object.values(networkInterfaces())) for (const entry of entries ?? []) if (entry.family === 'IPv4' && !entry.internal) return entry.address; return '127.0.0.1' }
  #readBody(request: IncomingMessage): Promise<Record<string, unknown>> { return new Promise((resolve, reject) => { let body = ''; request.setEncoding('utf8'); request.on('data', (chunk: string) => { body += chunk; if (body.length > 8192) request.destroy(new Error('Remote action payload is too large')) }); request.on('end', () => { try { resolve(JSON.parse(body) as Record<string, unknown>) } catch (error) { reject(error instanceof Error ? error : new Error('Invalid remote action payload')) } }); request.on('error', (error) => reject(error)) }) }
}
