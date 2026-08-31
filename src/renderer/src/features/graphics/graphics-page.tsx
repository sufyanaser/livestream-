import { useState } from 'react'
import { Clock3, Copy, Image, MessageSquareText, Plus, Sparkles, Timer, Type } from 'lucide-react'
import type { GraphicKind, ProjectDocument } from '../../../../shared/project'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader } from '@/components/ui/panel'
import { useGraphicsController } from '@/hooks/use-graphics-controller'
import { cn } from '@/lib/cn'

const icons: Record<GraphicKind, typeof Type> = { 'lower-third': Type, 'logo-bug': Image, ticker: MessageSquareText, clock: Clock3, countdown: Timer, sponsor: Sparkles }
type EditorMode = 'lower-third' | 'ticker' | 'clock'

export function GraphicsPage({ project }: { project: ProjectDocument }): React.JSX.Element {
  const [mode, setMode] = useState<EditorMode>('lower-third')
  const { state, update } = useGraphicsController()
  const isVisible = mode === 'lower-third' ? state.lowerThird.visible : mode === 'ticker' ? state.ticker.visible : state.clock.visible

  const toggleVisible = (): void => {
    if (mode === 'lower-third') void update({ lowerThird: { visible: !state.lowerThird.visible } })
    if (mode === 'ticker') void update({ ticker: { visible: !state.ticker.visible } })
    if (mode === 'clock') void update({ clock: { visible: !state.clock.visible } })
  }

  return (
    <div className="page-shell">
      <div className="page-heading"><div><span className="eyebrow">Local HTML broadcast graphics</span><h2>Graphics Engine</h2><p>Design and operate overlays offline. The output URL becomes one OBS Browser Source during final integration.</p></div><div className="flex gap-2"><Button variant="ghost" onClick={() => void navigator.clipboard.writeText(state.endpoint)}><Copy className="size-4" />Copy output URL</Button><Button><Plus className="size-4" />New template</Button></div></div>
      <div className="grid min-h-0 flex-1 grid-cols-[260px_minmax(440px,1fr)_340px] gap-4">
        <Panel className="min-h-0"><PanelHeader><h3 className="panel-title">Templates</h3><Badge>{project.graphicTemplates.length}</Badge></PanelHeader><div className="space-y-2 overflow-auto p-3">{project.graphicTemplates.map((template) => { const Icon = icons[template.kind]; return <button key={template.id} type="button" className={cn('flex w-full items-center gap-3 rounded-xl border p-3 text-left transition', mode === template.kind || (mode === 'clock' && template.kind === 'countdown') ? 'border-sky-400/25 bg-sky-400/[0.06]' : 'border-white/[0.06] bg-white/[0.02]')} onClick={() => { if (template.kind === 'lower-third' || template.kind === 'ticker' || template.kind === 'clock' || template.kind === 'countdown') setMode(template.kind === 'countdown' ? 'clock' : template.kind); if (template.kind === 'logo-bug') void update({ logoVisible: !state.logoVisible }); if (template.kind === 'sponsor') void update({ sponsorVisible: !state.sponsorVisible }) }}><div className="flex size-9 items-center justify-center rounded-lg border border-white/[0.07] bg-black/20"><Icon className="size-4" style={{ color: template.accentColor }} /></div><div className="min-w-0 flex-1"><strong className="block truncate text-xs font-medium text-zinc-200">{template.name}</strong><span className="mt-1 block text-[9px] uppercase text-zinc-600">{template.kind}</span></div></button>})}</div></Panel>

        <Panel className="flex min-h-0 flex-col"><PanelHeader><h3 className="panel-title">Output Preview</h3><Badge tone={isVisible ? 'live' : 'neutral'}>{isVisible ? 'On air' : 'Off air'}</Badge></PanelHeader><div className="flex min-h-0 flex-1 flex-col p-4"><div className="relative aspect-video overflow-hidden rounded-xl border border-white/[0.07] bg-[radial-gradient(circle_at_50%_45%,#142031,#05070a_70%)]">
          <div className={cn('absolute inset-x-[7%] bottom-[12%] flex items-end transition duration-300', state.lowerThird.visible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-25')} dir={state.lowerThird.direction}><div className="h-16 w-1.5 rounded-l" style={{ background: state.lowerThird.accentColor }} /><div className="min-w-[58%] rounded-r-lg border border-white/10 bg-[#111827]/92 px-5 py-3 shadow-2xl"><strong className="block text-sm text-white">{state.lowerThird.name || 'Guest Name'}</strong><span className="mt-1 block text-[10px] text-zinc-400">{[state.lowerThird.title, state.lowerThird.organization].filter(Boolean).join(' · ')}</span></div></div>
          <div className={cn('absolute inset-x-0 bottom-0 h-9 border-t border-white/10 bg-[#0b111b]/95 px-4 text-[10px] leading-9 text-zinc-300 transition', state.ticker.visible ? 'translate-y-0' : 'translate-y-full')}>{state.ticker.text}</div>
          <div className={cn('absolute right-[4%] top-[6%] rounded-lg border border-white/10 bg-black/55 px-3 py-2 font-mono text-xs transition', state.clock.visible ? 'opacity-100' : 'opacity-25')}>{state.clock.mode === 'clock' ? '12:00:00' : '00:10:00'}</div>
          <div className={cn('absolute bottom-[8%] right-[4%] text-xs font-bold tracking-[.18em] transition', state.logoVisible ? 'opacity-100' : 'opacity-0')}>NAS</div>
        </div><div className="mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-3 py-2 font-mono text-[10px] text-zinc-600">{state.endpoint || 'Graphics engine starting…'}</div><div className="mt-auto grid grid-cols-2 gap-2 pt-4"><Button variant="ghost">Preview</Button><Button variant={isVisible ? 'danger' : 'default'} onClick={toggleVisible}>{isVisible ? 'Take out' : 'Take graphic'}</Button></div></div></Panel>

        <Panel><PanelHeader><h3 className="panel-title">Editor · {mode}</h3></PanelHeader><div className="space-y-4 p-4">
          {mode === 'lower-third' && <><label className="settings-field"><span>Name</span><input value={state.lowerThird.name} onChange={(event) => void update({ lowerThird: { name: event.target.value } })} /></label><label className="settings-field"><span>Title</span><input value={state.lowerThird.title} onChange={(event) => void update({ lowerThird: { title: event.target.value } })} /></label><label className="settings-field"><span>Organization</span><input value={state.lowerThird.organization} onChange={(event) => void update({ lowerThird: { organization: event.target.value } })} /></label><label className="settings-field"><span>Accent</span><input type="color" value={state.lowerThird.accentColor} onChange={(event) => void update({ lowerThird: { accentColor: event.target.value } })} /></label></>}
          {mode === 'ticker' && <><label className="settings-field"><span>Ticker text</span><textarea className="min-h-28 rounded-lg border border-white/[0.08] bg-black/20 p-3 text-xs text-zinc-300 outline-none" value={state.ticker.text} onChange={(event) => void update({ ticker: { text: event.target.value } })} /></label><label className="settings-field"><span>Speed · {state.ticker.speed}</span><input type="range" min="5" max="30" value={state.ticker.speed} onChange={(event) => void update({ ticker: { speed: Number(event.target.value) } })} /></label></>}
          {mode === 'clock' && <><label className="settings-field"><span>Mode</span><select className="obs-input" value={state.clock.mode} onChange={(event) => void update({ clock: { mode: event.target.value as 'clock' | 'countdown' } })}><option value="clock">Clock</option><option value="countdown">Countdown</option></select></label>{state.clock.mode === 'countdown' && <label className="settings-field"><span>Target time</span><input type="datetime-local" value={state.clock.targetTime?.slice(0, 16) ?? ''} onChange={(event) => void update({ clock: { targetTime: event.target.value ? new Date(event.target.value).toISOString() : null } })} /></label>}</>}
        </div></Panel>
      </div>
    </div>
  )
}
