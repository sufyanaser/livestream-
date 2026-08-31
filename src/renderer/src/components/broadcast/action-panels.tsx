import { ArrowRight, Radio, Send, Sparkles, Type } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { useGraphicsController } from '@/hooks/use-graphics-controller'

export function TransitionPanel({ activeName, duration, disabled, onSelect }: { activeName: string | null; duration: number; disabled: boolean; onSelect: (name: string) => void }): React.JSX.Element {
  return (
    <Panel>
      <PanelHeader><h2 className="panel-title">Transitions</h2><span className="text-[10px] text-zinc-600">{duration} ms</span></PanelHeader>
      <div className="grid grid-cols-3 gap-2 p-2.5">
        {['Cut', 'Fade', 'Stinger'].map((name) => (
          <Button key={name} disabled={disabled} variant={activeName === name ? 'default' : 'ghost'} className="h-10" onClick={() => onSelect(name)}>{name === 'Stinger' && <Sparkles className="size-3.5" />}{name}</Button>
        ))}
      </div>
    </Panel>
  )
}

export function LowerThirdPanel(): React.JSX.Element {
  const graphics = useGraphicsController()
  return (
    <Panel>
      <PanelHeader><div className="flex items-center gap-2"><Type className="size-4 text-violet-300" /><h2 className="panel-title">Lower Thirds</h2></div><span className="text-[10px] text-zinc-600">{graphics.state.lowerThird.visible ? 'On air' : 'Off air'}</span></PanelHeader>
      <div className="space-y-2.5 p-3">
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
          <label className="field"><span>Name</span><input className="min-w-0 bg-transparent text-[11px] font-medium text-zinc-300 outline-none" value={graphics.state.lowerThird.name} onChange={(event) => void graphics.update({ lowerThird: { name: event.target.value } })} /></label>
          <label className="field"><span>Title</span><input className="min-w-0 bg-transparent text-[11px] font-medium text-zinc-300 outline-none" value={graphics.state.lowerThird.title} onChange={(event) => void graphics.update({ lowerThird: { title: event.target.value } })} /></label>
          <Button variant={graphics.state.lowerThird.visible ? 'danger' : 'ghost'} className="h-full" onClick={() => void graphics.update({ lowerThird: { visible: !graphics.state.lowerThird.visible } })}><Send className="size-3.5" />{graphics.state.lowerThird.visible ? 'Out' : 'Take'}</Button>
        </div>
      </div>
    </Panel>
  )
}

export function TakeBar({ disabled, onTake }: { disabled: boolean; onTake: () => void }): React.JSX.Element {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-[#10141b]/90 p-2 shadow-xl backdrop-blur-xl">
      <Button variant="ghost" className="h-11 flex-1"><Radio className="size-4" />Preview selected</Button>
      <Button className="h-11 flex-[1.4] text-sm uppercase tracking-[0.16em]" disabled={disabled} onClick={onTake}><ArrowRight className="size-4" />Take</Button>
    </div>
  )
}
