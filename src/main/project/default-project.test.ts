import { describe, expect, it } from 'vitest'
import { PROJECT_SCHEMA_VERSION } from '../../shared/project'
import { createDefaultProject } from './default-project'
import { isProjectDocument } from './project-repository'

describe('default project', () => {
  it('creates a valid production workspace with unique ids', () => {
    const project = createDefaultProject()
    const ids = [...project.layouts.map((item) => item.id), ...project.sourceSlots.map((item) => item.id), ...project.graphicTemplates.map((item) => item.id)]
    expect(project.schemaVersion).toBe(PROJECT_SCHEMA_VERSION)
    expect(project.layouts).toHaveLength(6)
    expect(project.sourceSlots).toHaveLength(6)
    expect(new Set(ids).size).toBe(ids.length)
    expect(isProjectDocument(project)).toBe(true)
  })

  it('rejects unsupported data', () => {
    expect(isProjectDocument({ schemaVersion: 99, id: 'bad' })).toBe(false)
    expect(isProjectDocument(null)).toBe(false)
  })
})
