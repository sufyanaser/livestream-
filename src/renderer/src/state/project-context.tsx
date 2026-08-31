/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { ProjectDocument } from '../../../shared/project'

type SaveStatus = 'loading' | 'saved' | 'saving' | 'error'

interface ProjectContextValue {
  project: ProjectDocument | null
  saveStatus: SaveStatus
  updateProject: (updater: (project: ProjectDocument) => ProjectDocument) => void
  saveNow: () => Promise<void>
}

const ProjectContext = createContext<ProjectContextValue | null>(null)

export function ProjectProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [project, setProject] = useState<ProjectDocument | null>(null)
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('loading')
  const [revision, setRevision] = useState(0)
  const projectRef = useRef<ProjectDocument | null>(null)
  const loadedRef = useRef(false)

  useEffect(() => {
    let active = true
    const unsubscribe = window.nasBroadcast.project.onChanged((nextProject) => {
      if (!active) return
      projectRef.current = nextProject
      setProject(nextProject)
      setSaveStatus('saved')
    })
    void window.nasBroadcast.project.get().then((nextProject) => {
      if (!active) return
      loadedRef.current = true
      projectRef.current = nextProject
      setProject(nextProject)
      setSaveStatus('saved')
    }).catch(() => {
      if (active) setSaveStatus('error')
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    const currentProject = projectRef.current
    if (revision === 0 || !currentProject || !loadedRef.current || !currentProject.operator.autoSave) return
    setSaveStatus('saving')
    const timer = window.setTimeout(() => {
      const pendingProject = projectRef.current
      if (!pendingProject) return
      void window.nasBroadcast.project.save(pendingProject).then((saved) => {
        projectRef.current = saved
        setProject(saved)
        setSaveStatus('saved')
      }).catch(() => setSaveStatus('error'))
    }, 600)
    return () => window.clearTimeout(timer)
  }, [revision])

  const updateProject = useCallback((updater: (current: ProjectDocument) => ProjectDocument) => {
    setProject((current) => {
      if (!current) return current
      const next = updater(current)
      projectRef.current = next
      setRevision((value) => value + 1)
      return next
    })
  }, [])

  const saveNow = useCallback(async (): Promise<void> => {
    const current = projectRef.current
    if (!current) return
    setSaveStatus('saving')
    try {
      const saved = await window.nasBroadcast.project.save(current)
      projectRef.current = saved
      setProject(saved)
      setSaveStatus('saved')
    } catch {
      setSaveStatus('error')
    }
  }, [])

  return <ProjectContext.Provider value={{ project, saveStatus, updateProject, saveNow }}>{children}</ProjectContext.Provider>
}

export function useProject(): ProjectContextValue {
  const context = useContext(ProjectContext)
  if (!context) throw new Error('useProject must be used within ProjectProvider')
  return context
}
