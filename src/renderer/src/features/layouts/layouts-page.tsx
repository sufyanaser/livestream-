import { Check, MonitorUp, Plus } from 'lucide-react'
import type { ObsLayoutSource } from '../../../../shared/obs'
import type { ProjectDocument } from '../../../../shared/project'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { useObsController } from '@/hooks/use-obs-controller'
import { cn } from '@/lib/cn'

interface LayoutsPageProps {
  project: ProjectDocument
  updateProject: (updater: (project: ProjectDocument) => ProjectDocument) => void
}

export function LayoutsPage({ project, updateProject }: LayoutsPageProps): React.JSX.Element {
  const obs = useObsController()
  const activeLayout = project.layouts.find((layout) => layout.id === project.activeLayoutId) ?? project.layouts[0]
  const mappedSources = activeLayout.slots.flatMap<ObsLayoutSource>((slot) => {
    const source = project.sourceSlots.find((candidate) => candidate.id === slot.sourceSlotId)
    return source?.obsInputName ? [{ inputName: source.obsInputName, x: slot.x, y: slot.y, width: slot.width, height: slot.height }] : []
  })

  const duplicateActiveLayout = (): void => {
    const layoutId = crypto.randomUUID()
    const duplicate = { ...activeLayout, id: layoutId, name: `${activeLayout.name} Copy`, slots: activeLayout.slots.map((slot) => ({ ...slot, id: crypto.randomUUID() })) }
    updateProject((current) => ({ ...current, layouts: [...current.layouts, duplicate], activeLayoutId: layoutId }))
  }

  const setSourceMapping = (sourceSlotId: string, obsInputName: string): void => {
    updateProject((current) => ({ ...current, sourceSlots: current.sourceSlots.map((source) => source.id === sourceSlotId ? { ...source, obsInputName: obsInputName || null } : source) }))
  }

  const toggleSafeArea = (): void => {
    updateProject((current) => ({ ...current, layouts: current.layouts.map((layout) => layout.id === activeLayout.id ? { ...layout, safeArea: !layout.safeArea } : layout) }))
  }

  return (
    <div className="page-shell">
      <div className="page-heading">
        <div><span className="eyebrow">Composition workspace</span><h2>Layout Composer</h2><p>Build layouts offline, map source roles, then apply the exact geometry to OBS.</p></div>
        <Button onClick={duplicateActiveLayout}><Plus className="size-4" />Duplicate layout</Button>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(560px,1fr)] gap-4">
        <Panel className="min-h-0 overflow-auto">
          <PanelHeader><h3 className="panel-title">Preset Library</h3><Badge>{project.layouts.length}</Badge></PanelHeader>
          <div className="space-y-2 p-3">
            {project.layouts.map((layout) => (
              <button key={layout.id} type="button" className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition', layout.id === activeLayout.id ? 'border-sky-400/25 bg-sky-400/[0.07]' : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]')} onClick={() => updateProject((current) => ({ ...current, activeLayoutId: layout.id }))}>
                <div className="flex size-10 items-center justify-center rounded-lg border border-white/[0.07] bg-black/20"><MonitorUp className="size-4 text-zinc-500" /></div>
                <div className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium text-zinc-200">{layout.name}</strong><span className="mt-1 block text-[10px] text-zinc-600">{layout.slots.length} source slots</span></div>
                {layout.id === activeLayout.id && <Check className="size-4 text-sky-300" />}
              </button>
            ))}
          </div>
          <PanelHeader><h3 className="panel-title">OBS Source Mapping</h3><Badge tone={obs.isConnected ? 'ready' : 'neutral'}>{obs.state.inputs.length}</Badge></PanelHeader>
          <div className="space-y-3 p-3">
            {project.sourceSlots.map((source) => (
              <label key={source.id} className="block text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-500">
                {source.label}
                <select className="mt-1.5 h-9 w-full rounded-lg border border-white/10 bg-[#0b0f14] px-2 text-xs normal-case tracking-normal text-zinc-200 outline-none focus:border-sky-400/40" value={source.obsInputName ?? ''} onChange={(event) => setSourceMapping(source.id, event.target.value)}>
                  <option value="">Unassigned</option>
                  {source.obsInputName && !obs.state.inputs.some((input) => input.name === source.obsInputName) && <option value={source.obsInputName}>{source.obsInputName} (offline)</option>}
                  {obs.state.inputs.map((input) => <option key={input.name} value={input.name}>{input.name}</option>)}
                </select>
              </label>
            ))}
          </div>
        </Panel>
        <Panel className="flex min-h-0 flex-col">
          <PanelHeader>
            <div><h3 className="panel-title">{activeLayout.name}</h3></div>
            <div className="flex items-center gap-2">
              <Badge tone={obs.isConnected ? 'ready' : 'neutral'}>{obs.isConnected ? 'OBS ready' : 'Offline'}</Badge>
              <Button size="sm" variant="ghost" onClick={toggleSafeArea}>{activeLayout.safeArea ? 'Hide safe area' : 'Show safe area'}</Button>
              <Button size="sm" disabled={!obs.isConnected || mappedSources.length === 0} onClick={() => void obs.applyLayout(activeLayout.name, mappedSources)}>Apply to OBS</Button>
            </div>
          </PanelHeader>
          <div className="flex min-h-0 flex-1 items-center justify-center p-8">
            <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl border border-white/10 bg-[radial-gradient(circle_at_50%_45%,#182331,#080b10_70%)] shadow-2xl">
              {activeLayout.slots.map((slot, index) => {
                const source = project.sourceSlots.find((candidate) => candidate.id === slot.sourceSlotId) ?? project.sourceSlots[index]
                return <div key={slot.id} className="absolute flex flex-col items-center justify-center rounded-lg border border-dashed border-sky-300/25 bg-sky-400/[0.05] px-2 text-center text-xs font-semibold text-sky-200/60" style={{ left: `${slot.x * 100}%`, top: `${slot.y * 100}%`, width: `${slot.width * 100}%`, height: `${slot.height * 100}%` }}><span>{source?.label ?? `Source ${index + 1}`}</span><small className="mt-1 max-w-full truncate text-[9px] font-normal text-zinc-500">{source?.obsInputName ?? 'Unassigned'}</small></div>
              })}
              {activeLayout.safeArea && <div className="pointer-events-none absolute inset-[5%] rounded border border-amber-300/20" />}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
