import { randomUUID } from 'node:crypto'
import { PROJECT_SCHEMA_VERSION, type LayoutKind, type LayoutPreset, type ProjectDocument } from '../../shared/project'

const slot = (x: number, y: number, width: number, height: number) => ({ id: randomUUID(), sourceSlotId: null, x, y, width, height })

const layout = (name: string, kind: LayoutKind, slots: ReturnType<typeof slot>[]): LayoutPreset => ({
  id: randomUUID(), name, kind, slots, safeArea: true
})

export function createDefaultProject(): ProjectDocument {
  const now = new Date().toISOString()
  const layouts = [
    layout('Full Frame', 'full', [slot(0, 0, 1, 1)]),
    layout('2-Up Split', 'split-2', [slot(0, 0, 0.5, 1), slot(0.5, 0, 0.5, 1)]),
    layout('Interview 3-Up', 'split-3', [slot(0, 0, 0.5, 1), slot(0.5, 0, 0.5, 0.5), slot(0.5, 0.5, 0.5, 0.5)]),
    layout('Quad View', 'grid-4', [slot(0, 0, 0.5, 0.5), slot(0.5, 0, 0.5, 0.5), slot(0, 0.5, 0.5, 0.5), slot(0.5, 0.5, 0.5, 0.5)]),
    layout('Picture in Picture', 'pip', [slot(0, 0, 1, 1), slot(0.68, 0.62, 0.28, 0.32)]),
    layout('Speaker + Deck', 'speaker-deck', [slot(0, 0, 0.7, 1), slot(0.72, 0.08, 0.26, 0.42)])
  ]

  return {
    schemaVersion: PROJECT_SCHEMA_VERSION,
    id: randomUUID(),
    name: 'ABTF 2026 Broadcast',
    eventName: 'Anbar International Fair',
    createdAt: now,
    updatedAt: now,
    canvas: { width: 1920, height: 1080, fps: 30 },
    sourceSlots: [
      { id: randomUUID(), label: 'Camera 01', role: 'camera', color: '#38bdf8', obsInputName: null },
      { id: randomUUID(), label: 'Camera 02', role: 'camera', color: '#60a5fa', obsInputName: null },
      { id: randomUUID(), label: 'GoPro 01', role: 'capture', color: '#a78bfa', obsInputName: null },
      { id: randomUUID(), label: 'Stage Feed', role: 'capture', color: '#f59e0b', obsInputName: null },
      { id: randomUUID(), label: 'Media Player', role: 'media', color: '#10b981', obsInputName: null },
      { id: randomUUID(), label: 'Remote Feed', role: 'remote', color: '#f472b6', obsInputName: null }
    ],
    layouts,
    graphicTemplates: [
      { id: randomUUID(), name: 'Primary Lower Third', kind: 'lower-third', accentColor: '#38bdf8', direction: 'rtl', durationSeconds: 8 },
      { id: randomUUID(), name: 'NAS Logo Bug', kind: 'logo-bug', accentColor: '#ffffff', direction: 'ltr', durationSeconds: null },
      { id: randomUUID(), name: 'Event Ticker', kind: 'ticker', accentColor: '#38bdf8', direction: 'rtl', durationSeconds: null },
      { id: randomUUID(), name: 'Sponsor Card', kind: 'sponsor', accentColor: '#f59e0b', direction: 'ltr', durationSeconds: 6 }
    ],
    guests: [],
    rundown: [],
    macros: [],
    activeLayoutId: layouts[0].id,
    activeRundownItemId: null,
    operator: { language: 'en', confirmProgramChanges: true, autoSave: true }
  }
}

