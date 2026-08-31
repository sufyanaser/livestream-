import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { PROJECT_SCHEMA_VERSION, type ProjectDocument } from '../../shared/project'
import { createDefaultProject } from './default-project'

const isProjectDocument = (value: unknown): value is ProjectDocument => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<ProjectDocument>
  return candidate.schemaVersion === PROJECT_SCHEMA_VERSION && typeof candidate.id === 'string' && typeof candidate.name === 'string' && Array.isArray(candidate.layouts) && Array.isArray(candidate.rundown)
}

export class ProjectRepository {
  readonly #filePath: string
  #project: ProjectDocument | null = null
  #writeQueue: Promise<void> = Promise.resolve()

  constructor(userDataPath: string) {
    this.#filePath = join(userDataPath, 'projects', 'active-project.json')
  }

  async initialize(): Promise<ProjectDocument> {
    await mkdir(dirname(this.#filePath), { recursive: true })
    try {
      const parsed: unknown = JSON.parse(await readFile(this.#filePath, 'utf8'))
      if (!isProjectDocument(parsed)) throw new Error('Unsupported project schema')
      this.#project = parsed
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        const backupPath = `${this.#filePath}.corrupt-${Date.now()}`
        await rename(this.#filePath, backupPath).catch(() => undefined)
      }
      this.#project = createDefaultProject()
      await this.save(this.#project)
    }
    return this.get()
  }

  get(): ProjectDocument {
    if (!this.#project) throw new Error('Project repository is not initialized')
    return structuredClone(this.#project)
  }

  async save(project: ProjectDocument): Promise<ProjectDocument> {
    if (!isProjectDocument(project)) throw new Error('Invalid project document')
    const nextProject = structuredClone({ ...project, updatedAt: new Date().toISOString() })
    const payload = JSON.stringify(nextProject, null, 2)
    this.#writeQueue = this.#writeQueue.then(async () => {
      const temporaryPath = `${this.#filePath}.tmp`
      await writeFile(temporaryPath, payload, { encoding: 'utf8', flag: 'w' })
      await rename(temporaryPath, this.#filePath)
    })
    await this.#writeQueue
    this.#project = nextProject
    return this.get()
  }
}

