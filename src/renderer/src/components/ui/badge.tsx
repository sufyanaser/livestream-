import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: 'neutral' | 'live' | 'warning' | 'ready'
}

const tones = {
  neutral: 'border-white/10 bg-white/[0.045] text-zinc-400',
  live: 'border-red-400/25 bg-red-500/10 text-red-300',
  warning: 'border-amber-400/25 bg-amber-500/10 text-amber-300',
  ready: 'border-emerald-400/25 bg-emerald-500/10 text-emerald-300'
}

export function Badge({ className, tone = 'neutral', ...props }: BadgeProps): React.JSX.Element {
  return (
    <span
      className={cn('inline-flex h-6 items-center rounded-md border px-2 text-[10px] font-semibold uppercase tracking-[0.14em]', tones[tone], className)}
      {...props}
    />
  )
}

