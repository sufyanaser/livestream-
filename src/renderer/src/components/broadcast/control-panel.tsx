import { ChevronRight, CirclePlay, GripVertical, Layers3, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'

const sources = ['Camera 01', 'Camera 02', 'Media Player', 'Sponsor Loop']
const layouts = ['Full Frame', '2-Up Split', 'Picture in Picture', 'Quad View']

export function SourcePanel(): React.JSX.Element {
  return (
    <Panel className="flex min-h-0 flex-col">
      <PanelHeader>
        <div className="flex items-center gap-2"><Layers3 className="size-4 text-sky-300" /><h2 className="panel-title">Sources</h2></div>
        <Button aria-label="Add source" size="icon" variant="ghost" className="size-7"><Plus className="size-3.5" /></Button>
      </PanelHeader>
      <div className="min-h-0 flex-1 space-y-1.5 overflow-auto p-2.5">
        {sources.map((source, index) => (
          <button key={source} className="control-row w-full" type="button">
            <GripVertical className="size-3.5 text-zinc-700" />
            <span className="size-2 rounded-full bg-zinc-700" />
            <span className="flex-1 text-left">{source}</span>
            <Badge className="h-5 px-1.5" tone={index < 2 ? 'ready' : 'neutral'}>{index < 2 ? 'Ready' : 'Idle'}</Badge>
          </button>
        ))}
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

