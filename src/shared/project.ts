export const PROJECT_SCHEMA_VERSION = 1 as const

export const PROJECT_CHANNELS = {
  get: 'project:get',
  save: 'project:save',
  import: 'project:import',
  export: 'project:export',
  changed: 'project:changed'
} as const

export type LayoutKind = 'full' | 'split-2' | 'split-3' | 'grid-4' | 'pip' | 'speaker-deck'
export type GraphicKind = 'lower-third' | 'logo-bug' | 'ticker' | 'clock' | 'countdown' | 'sponsor'
export type RundownStatus = 'ready' | 'standby' | 'completed'

export interface SourceSlot {
  id: string
  label: string
  role: 'camera' | 'capture' | 'media' | 'remote' | 'graphics'
  color: string
  obsInputName: string | null
}

export interface LayoutSlot {
  id: string
  sourceSlotId: string | null
  x: number
  y: number
  width: number
  height: number
}

export interface LayoutPreset {
  id: string
  name: string
  kind: LayoutKind
  slots: LayoutSlot[]
  safeArea: boolean
}

export interface GraphicTemplate {
  id: string
  name: string
  kind: GraphicKind
  accentColor: string
  direction: 'rtl' | 'ltr'
  durationSeconds: number | null
}

export interface Guest {
  id: string
  name: string
  title: string
  organization: string
  locale: 'ar' | 'en'
  notes: string
}

export interface RundownItem {
  id: string
  order: number
  title: string
  type: 'scene' | 'guest' | 'media' | 'graphic' | 'break'
  durationSeconds: number
  status: RundownStatus
  layoutId: string | null
  guestId: string | null
  graphicTemplateId: string | null
  notes: string
}

export interface MacroStep {
  id: string
  action: 'select-layout' | 'show-graphic' | 'hide-graphic' | 'take' | 'wait'
  targetId: string | null
  delayMs: number
}

export interface BroadcastMacro {
  id: string
  name: string
  hotkey: string | null
  steps: MacroStep[]
}

export interface ProjectDocument {
  schemaVersion: typeof PROJECT_SCHEMA_VERSION
  id: string
  name: string
  eventName: string
  createdAt: string
  updatedAt: string
  canvas: { width: number; height: number; fps: number }
  sourceSlots: SourceSlot[]
  layouts: LayoutPreset[]
  graphicTemplates: GraphicTemplate[]
  guests: Guest[]
  rundown: RundownItem[]
  macros: BroadcastMacro[]
  activeLayoutId: string
  activeRundownItemId: string | null
  operator: {
    language: 'ar' | 'en'
    confirmProgramChanges: boolean
    autoSave: boolean
  }
}

export interface ProjectBridge {
  get: () => Promise<ProjectDocument>
  save: (project: ProjectDocument) => Promise<ProjectDocument>
  importProject: () => Promise<ProjectDocument | null>
  exportProject: (project: ProjectDocument) => Promise<string | null>
  onChanged: (listener: (project: ProjectDocument) => void) => () => void
}
