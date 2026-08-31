import { Activity, CircleDot, Clock3, RadioTower, Settings2, WifiOff } from 'lucide-react'
import { LowerThirdPanel, TakeBar, TransitionPanel } from '@/components/broadcast/action-panels'
import { LayoutPanel, RundownPanel, SourcePanel } from '@/components/broadcast/control-panel'
import { Monitor } from '@/components/broadcast/monitor'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function AppShell(): React.JSX.Element {
  return (
    <div className="flex min-h-screen flex-col bg-[#07090d] text-zinc-100">
      <header className="app-drag-region flex h-16 shrink-0 items-center justify-between border-b border-white/[0.065] bg-[#0b0e13]/90 px-5 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.08] shadow-[inset_0_1px_rgba(255,255,255,.06)]"><RadioTower className="size-4.5 text-sky-300" /></div>
          <div><h1 className="text-sm font-semibold tracking-[0.02em]">NAS Broadcast Director</h1><p className="mt-0.5 text-[10px] uppercase tracking-[0.17em] text-zinc-600">Control surface · Stage 01</p></div>
        </div>
        <div className="app-no-drag flex items-center gap-2">
          <Badge tone="neutral"><WifiOff className="mr-1.5 size-3" />OBS Offline</Badge>
          <Button variant="ghost"><CircleDot className="size-3.5 text-zinc-600" />Connect OBS</Button>
          <Button aria-label="Settings" size="icon" variant="ghost"><Settings2 className="size-4" /></Button>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-[260px_minmax(650px,1fr)_280px] gap-3 p-3">
        <aside className="grid min-h-0 grid-rows-[minmax(260px,1fr)_auto] gap-3"><SourcePanel /><LayoutPanel /></aside>

        <section className="flex min-w-0 flex-col gap-3">
          <div className="grid grid-cols-2 gap-3"><Monitor label="PREVIEW" title="Preview bus" /><Monitor label="PROGRAM" title="Program output" live /></div>
          <div className="grid grid-cols-[1fr_320px] gap-3"><LowerThirdPanel /><TransitionPanel /></div>
          <div className="mt-auto"><TakeBar /></div>
        </section>

        <aside className="min-h-0"><RundownPanel /></aside>
      </main>

      <footer className="flex h-9 shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#0a0d12] px-4 text-[10px] text-zinc-600">
        <div className="flex items-center gap-4"><span className="flex items-center gap-1.5"><Activity className="size-3" />System ready</span><span>30 FPS</span><span>0 dropped frames</span></div>
        <div className="flex items-center gap-1.5 font-mono"><Clock3 className="size-3" /><span>--:--:--</span></div>
      </footer>
    </div>
  )
}

