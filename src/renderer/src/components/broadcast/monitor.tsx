import { Maximize2, Volume2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/cn'

interface MonitorProps {
  label: 'PREVIEW' | 'PROGRAM'
  title: string
  live?: boolean
}

export function Monitor({ label, title, live = false }: MonitorProps): React.JSX.Element {
  return (
    <article className={cn('group overflow-hidden rounded-xl border bg-black', live ? 'border-red-500/45' : 'border-white/[0.09]')}>
      <div className="relative aspect-video overflow-hidden bg-[radial-gradient(circle_at_50%_42%,#1c2734_0%,#0b1017_45%,#05070a_100%)]">
        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.04)_1px,transparent_1px)] [background-size:40px_40px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <div className="mb-3 flex size-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.035]">
            <div className="size-2 rounded-full bg-zinc-600" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">No video signal</p>
          <p className="mt-1 text-[11px] text-zinc-700">Connect OBS to populate this monitor</p>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/85 to-transparent p-3 pt-12">
          <Badge tone={live ? 'live' : 'neutral'}>
            {live && <span className="mr-1.5 size-1.5 rounded-full bg-red-400" />}
            {label}
          </Badge>
          <div className="flex gap-1.5 opacity-75 transition-opacity group-hover:opacity-100">
            <Button aria-label="Monitor audio" size="icon" variant="ghost" className="size-8 bg-black/40"><Volume2 className="size-3.5" /></Button>
            <Button aria-label="Fullscreen monitor" size="icon" variant="ghost" className="size-8 bg-black/40"><Maximize2 className="size-3.5" /></Button>
          </div>
        </div>
      </div>
      <div className="flex h-10 items-center justify-between border-t border-white/[0.06] bg-[#0e1218] px-3.5">
        <span className="text-xs font-medium text-zinc-300">{title}</span>
        <span className="font-mono text-[10px] text-zinc-600">00:00:00</span>
      </div>
    </article>
  )
}

