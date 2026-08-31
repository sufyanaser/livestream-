import { ChevronRight, CirclePlay, GripVertical, Layers3, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'
import type { ObsInputSummary, ObsSceneSummary } from '../../../../shared/obs'

const layouts = ['Full Frame', '2-Up Split', 'Picture in Picture', 'Quad View']

interface SourcePanelProps {
  inputs: ObsInputSummary[]
  scenes: ObsSceneSummary[]
  connected: boolean
  onSceneSelect?: (sceneName: string) => void
}

export function SourcePanel({ inputs, scenes, connected, onSceneSelect }: SourcePanelProps): React.JSX.Element {
  return (
    <Panel className="flex min-h-0 flex-col">
      <PanelHeader>
        <div className="flex items-center gap-2"><Layers3 className="size-4 text-sky-300" /><h2 className="panel-title">Sources</h2></div>
        <Button aria-label="Add source" size="icon" variant="ghost" className="size-7"><Plus className="size-3.5" /></Button>
      </PanelHeader>
      <div className="min-h-0 flex-1 overflow-auto p-2.5">
        <p className="section-label">Scenes · {scenes.length}</p>
        <div className="space-y-1.5">
          {scenes.map((scene) => (
            <button key={scene.uuid ?? scene.name} className="control-row w-full" type="button" onClick={() => onSceneSelect?.(scene.name)}>
              <GripVertical className="size-3.5 text-zinc-700" />
              <span className="size-2 rounded-full bg-sky-400/70" />
              <span className="flex-1 truncate text-left">{scene.name}</span>
              <Badge className="h-5 px-1.5">Scene</Badge>
            </button>
          ))}
          {connected && scenes.length === 0 && <p className="empty-state">No scenes returned by OBS</p>}
        </div>
        <p className="section-label mt-4">Sources · {inputs.length}</p>
        <div className="space-y-1.5">
        {inputs.map((input) => (
          <button key={input.uuid ?? input.name} className="control-row w-full" type="button">
            <GripVertical className="size-3.5 text-zinc-700" />
            <span className="size-2 rounded-full bg-emerald-400/60" />
            <span className="min-w-0 flex-1 truncate text-left">{input.name}</span>
            <Badge className="h-5 max-w-20 truncate px-1.5" tone="ready">{input.kind}</Badge>
          </button>
        ))}
        {!connected && <p className="empty-state">Connect OBS to load live scenes and sources</p>}
        {connected && inputs.length === 0 && <p className="empty-state">No sources returned by OBS</p>}
        </div>
      </div>
    </Panel>
  )
}

export function LayoutPanel(): React.JSX.Element {
  return (
    <Panel>
      <PanelHeader><h2 className="panel-title">Layouts</h2><span className="text-[10px] text-zinc-600">4 presets</span></PanelHeader>
      <div className="grid grid-cols-2 gap-2 p-2.5">
        {layouts.map((layout, index) => (
          <button key={layout} type="button" className="group rounded-lg border border-white/[0.07] bg-white/[0.025] p-2 text-left transition hover:border-sky-400/25 hover:bg-sky-400/[0.045]">
            <div className="mb-2 grid aspect-video grid-cols-2 gap-1 rounded border border-white/[0.06] bg-black/35 p-1">
              <span className={index === 0 ? 'col-span-2 rounded-sm bg-zinc-700/35' : 'rounded-sm bg-zinc-700/35'} />
              {index > 0 && <span className="rounded-sm bg-zinc-700/20" />}
            </div>
            <span className="text-[11px] font-medium text-zinc-400 group-hover:text-zinc-200">{layout}</span>
          </button>
        ))}
      </div>
    </Panel>
  )
}

export function RundownPanel(): React.JSX.Element {
  const items = ['Opening sting', 'Host introduction', 'Camera 02 wide', 'Sponsor break']
  return (
    <Panel className="flex min-h-0 flex-col">
      <PanelHeader><h2 className="panel-title">Rundown</h2><Badge>Draft</Badge></PanelHeader>
      <div className="min-h-0 flex-1 overflow-auto p-2.5">
        {items.map((item, index) => (
          <button key={item} type="button" className="control-row mb-1.5 w-full">
            <span className="font-mono text-[10px] text-zinc-600">{String(index + 1).padStart(2, '0')}</span>
            {index === 0 ? <CirclePlay className="size-3.5 text-amber-300" /> : <span className="size-3.5" />}
            <span className="flex-1 text-left">{item}</span>
            <ChevronRight className="size-3.5 text-zinc-700" />
          </button>
        ))}
      </div>
    </Panel>
  )
}
