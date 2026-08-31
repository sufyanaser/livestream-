import { Clock3, Image, MessageSquareText, Plus, Sparkles, Timer, Type } from 'lucide-react'
import type { GraphicKind, ProjectDocument } from '../../../../shared/project'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'

const icons: Record<GraphicKind, typeof Type> = { 'lower-third': Type, 'logo-bug': Image, ticker: MessageSquareText, clock: Clock3, countdown: Timer, sponsor: Sparkles }

export function GraphicsPage({ project }: { project: ProjectDocument }): React.JSX.Element {
  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">HTML broadcast graphics</span><h2>Graphics Library</h2><p>Reusable 1080p templates prepared for the local graphics engine.</p></div><Button><Plus className="size-4" />New template</Button></div>
      <div className="grid grid-cols-[minmax(520px,1fr)_360px] gap-4">
        <div className="grid auto-rows-min grid-cols-2 gap-3">{project.graphicTemplates.map((template) => { const Icon = icons[template.kind]; return <Panel key={template.id} className="group p-4 transition hover:border-sky-400/20"><div className="mb-7 flex items-start justify-between"><div className="flex size-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.03]"><Icon className="size-4" style={{ color: template.accentColor }} /></div><Badge>{template.kind}</Badge></div><h3 className="text-sm font-medium text-zinc-200">{template.name}</h3><p className="mt-1.5 text-[11px] text-zinc-600">{template.direction.toUpperCase()} · {template.durationSeconds ? `${template.durationSeconds}s auto-hide` : 'Persistent'}</p></Panel> } )}</div>
        <Panel><PanelHeader><h3 className="panel-title">Live Preview</h3><Badge tone="neutral">Off air</Badge></PanelHeader><div className="p-4"><div className="relative aspect-video overflow-hidden rounded-xl border border-white/[0.07] bg-[#05070a]"><div className="absolute inset-x-[7%] bottom-[12%] flex items-end"><div className="h-16 w-1.5 rounded-l bg-sky-400" /><div className="min-w-[58%] rounded-r-lg border border-white/10 bg-[#111827]/92 px-5 py-3 shadow-2xl"><strong className="block text-sm text-white">Guest Name</strong><span className="mt-1 block text-[10px] text-zinc-400">Title · Organization</span></div></div></div><div className="mt-4 grid grid-cols-2 gap-2"><Button variant="ghost">Preview</Button><Button>Take graphic</Button></div></div></Panel>
      </div>
    </div>
  )
}

