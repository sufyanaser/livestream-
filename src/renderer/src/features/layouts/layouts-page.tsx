import { Check, MonitorUp, Plus } from 'lucide-react'
import type { ProjectDocument } from '../../../../shared/project'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { cn } from '@/lib/cn'

export function LayoutsPage({ project, updateProject }: { project: ProjectDocument; updateProject: (updater: (project: ProjectDocument) => ProjectDocument) => void }): React.JSX.Element {
  const activeLayout = project.layouts.find((layout) => layout.id === project.activeLayoutId) ?? project.layouts[0]
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Composition workspace</span><h2>Layout Composer</h2><p>Build source arrangements offline, then map them to OBS during integration.</p></div><Button><Plus className="size-4" />New layout</Button></div>
      <div className="grid min-h-0 flex-1 grid-cols-[280px_minmax(560px,1fr)] gap-4">
        <Panel className="min-h-0"><PanelHeader><h3 className="panel-title">Preset Library</h3><Badge>{project.layouts.length}</Badge></PanelHeader><div className="space-y-2 overflow-auto p-3">{project.layouts.map((layout) => <button key={layout.id} type="button" className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition', layout.id === activeLayout.id ? 'border-sky-400/25 bg-sky-400/[0.07]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]')} onClick={() => updateProject((current) => ({ ...current, activeLayoutId: layout.id }))}><div className="flex size-10 items-center justify-center rounded-lg border border-white/[0.07] bg-black/20"><MonitorUp className="size-4 text-zinc-500" /></div><div className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium text-zinc-200">{layout.name}</strong><span className="mt-1 block text-[10px] text-zinc-600">{layout.slots.length} source slots</span></div>{layout.id === activeLayout.id && <Check className="size-4 text-sky-300" />}</button>)}</div></Panel>
        <Panel className="flex min-h-0 flex-col"><PanelHeader><div><h3 className="panel-title">{activeLayout.name}</h3></div><div className="flex items-center gap-2"><Badge tone="ready">1920 × 1080</Badge><Button size="sm" variant="ghost">Safe area</Button></div></PanelHeader><div className="flex min-h-0 flex-1 items-center justify-center p-8"><div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_45%,#182331,#080b10_70%)] shadow-2xl">{activeLayout.slots.map((slot, index) => <button key={slot.id} type="button" className="absolute flex items-center justify-center rounded-lg border border-dashed border-sky-300/25 bg-sky-400/[0.05] text-xs font-semibold text-sky-200/60 transition hover:bg-sky-400/[0.1]" style={{ left: `${slot.x * 100}%`, top: `${slot.y * 100}%`, width: `${slot.width * 100}%`, height: `${slot.height * 100}%` }}>Source {index + 1}</button>)}<div className="pointer-events-none absolute inset-[5%] rounded border border-amber-300/10" /></div></div></Panel>
      </div>
    </div>
  )
}

