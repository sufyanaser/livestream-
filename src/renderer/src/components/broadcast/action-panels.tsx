import { ArrowRight, Radio, Send, Sparkles, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'

export function TransitionPanel(): React.JSX.Element {
  return (
    <Panel>
      <PanelHeader><h2 className="panel-title">Transitions</h2><span className="text-[10px] text-zinc-600">300 ms</span></PanelHeader>
      <div className="grid grid-cols-3 gap-2 p-2.5">
        {['Cut', 'Fade', 'Stinger'].map((name, index) => (
          <Button key={name} variant={index === 0 ? 'default' : 'ghost'} className="h-10">{index === 2 && <Sparkles className="size-3.5" />}{name}</Button>
        ))}
      </div>
    </Panel>
  )
}

export function LowerThirdPanel(): React.JSX.Element {
  return (
    <Panel>
      <PanelHeader><div className="flex items-center gap-2"><Type className="size-4 text-violet-300" /><h2 className="panel-title">Lower Thirds</h2></div><span className="text-[10px] text-zinc-600">Off air</span></PanelHeader>
      <div className="space-y-2.5 p-3">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <div className="field"><span>Name</span><strong>Guest name</strong></div>
          <div className="field"><span>Title</span><strong>Role / Organization</strong></div>
          <Button variant="ghost" className="h-full"><Send className="size-3.5" />Cue</Button>
        </div>
      </div>
    </Panel>
  )
}

export function TakeBar(): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#10141b]/90 p-2 shadow-xl backdrop-blur-xl">
      <Button variant="ghost" className="h-11 flex-1"><Radio className="size-4" />Preview selected</Button>
      <Button className="h-11 flex-[1.4] text-sm uppercase tracking-[0.16em]"><ArrowRight className="size-4" />Take</Button>
    </div>
  )
}

