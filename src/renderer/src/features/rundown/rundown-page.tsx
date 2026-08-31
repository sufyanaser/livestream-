import { GripVertical, Plus } from 'lucide-react'
import type { ProjectDocument, RundownItem } from '../../../../shared/project'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'

export function RundownPage({ project, updateProject }: { project: ProjectDocument; updateProject: (updater: (project: ProjectDocument) => ProjectDocument) => void }): React.JSX.Element {
  const addItem = (): void => {
    const item: RundownItem = { id: crypto.randomUUID(), order: project.rundown.length + 1, title: 'New cue', type: 'scene', durationSeconds: 60, status: 'standby', layoutId: project.activeLayoutId, guestId: null, graphicTemplateId: null, notes: '' }
    updateProject((current) => ({ ...current, rundown: [...current.rundown, item] }))
  }
  return <div className="page-shell"><div className="page-heading"><div><span className="eyebrow">Cue-driven operation</span><h2>Rundown</h2><p>Prepare the show sequence before connecting to the video engine.</p></div><Button onClick={addItem}><Plus className="size-4" />Add cue</Button></div><Panel className="min-h-0 flex-1"><div className="rundown-grid border-b border-white/[0.06] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600"><span>#</span><span>Cue</span><span>Type</span><span>Duration</span><span>Status</span></div>{project.rundown.map((item) => <button key={item.id} type="button" className="rundown-grid w-full items-center border-b border-white/[0.045] px-4 py-3 text-left hover:bg-white/[0.025]" onClick={() => updateProject((current) => ({ ...current, activeRundownItemId: item.id }))}><span className="flex items-center gap-2 font-mono text-[10px] text-zinc-600"><GripVertical className="size-3.5" />{String(item.order).padStart(2, '0')}</span><strong className="text-xs font-medium text-zinc-200">{item.title}</strong><span className="text-[10px] uppercase text-zinc-600">{item.type}</span><span className="font-mono text-[11px] text-zinc-500">{Math.floor(item.durationSeconds / 60)}:{String(item.durationSeconds % 60).padStart(2, '0')}</span><Badge tone={item.status === 'ready' ? 'ready' : 'neutral'}>{item.status}</Badge></button>)}{project.rundown.length === 0 && <div className="flex h-64 items-center justify-center text-xs text-zinc-600">No cues in the rundown.</div>}</Panel></div>
}

