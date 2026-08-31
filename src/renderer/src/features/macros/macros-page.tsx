import { Command, Plus, Zap } from 'lucide-react'
import type { BroadcastMacro, ProjectDocument } from '../../../../shared/project'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'

export function MacrosPage({ project, updateProject }: { project: ProjectDocument; updateProject: (updater: (project: ProjectDocument) => ProjectDocument) => void }): React.JSX.Element {
  const addMacro = (): void => { const macro: BroadcastMacro = { id: crypto.randomUUID(), name: 'New macro', hotkey: null, steps: [] }; updateProject((current) => ({ ...current, macros: [...current.macros, macro] })) }
  return <div className="page-shell"><div className="page-heading"><div><span className="eyebrow">One-button workflows</span><h2>Macros</h2><p>Compose deterministic operator actions without requiring OBS.</p></div><Button onClick={addMacro}><Plus className="size-4" />New macro</Button></div><div className="grid auto-rows-min grid-cols-3 gap-3">{project.macros.map((macro) => <Panel key={macro.id} className="p-4"><div className="flex items-start justify-between"><div className="flex size-10 items-center justify-center rounded-xl border border-amber-300/15 bg-amber-300/[0.05]"><Zap className="size-4 text-amber-300" /></div><Badge>{macro.steps.length} steps</Badge></div><h3 className="mt-6 text-sm font-medium text-zinc-200">{macro.name}</h3><p className="mt-1 text-[10px] text-zinc-600">{macro.hotkey ?? 'No hotkey assigned'}</p></Panel>)}<button type="button" className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-white/[0.08] text-zinc-700 hover:border-sky-400/20 hover:text-sky-300" onClick={addMacro}><Command className="mb-2 size-5" /><span className="text-xs">Create macro</span></button></div></div>
}

