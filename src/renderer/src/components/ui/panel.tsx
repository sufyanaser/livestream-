import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Panel({ className, ...props }: HTMLAttributes<HTMLElement>): React.JSX.Element {
  return (
    <section
      className={cn('overflow-hidden rounded-xl border border-white/[0.075] bg-[#11151c]/82 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl', className)}
      {...props}
    />
  )
}

export function PanelHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>): React.JSX.Element {
  return <div className={cn('flex h-11 items-center justify-between border-b border-white/[0.06] px-4', className)} {...props} />
}

