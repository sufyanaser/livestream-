import { Blocks, Clapperboard, Command, LayoutDashboard, ListOrdered, Settings2, Sparkles, Users } from 'lucide-react'
import { cn } from '@/lib/cn'

export type WorkspacePage = 'director' | 'layouts' | 'graphics' | 'rundown' | 'guests' | 'macros' | 'settings'

const navigation = [
  { id: 'director', label: 'Director', icon: Clapperboard },
  { id: 'layouts', label: 'Layouts', icon: LayoutDashboard },
  { id: 'graphics', label: 'Graphics', icon: Sparkles },
  { id: 'rundown', label: 'Rundown', icon: ListOrdered },
  { id: 'guests', label: 'Guests', icon: Users },
  { id: 'macros', label: 'Macros', icon: Command }
] satisfies Array<{ id: WorkspacePage; label: string; icon: typeof Blocks }>

export function WorkspaceSidebar({ activePage, onChange }: { activePage: WorkspacePage; onChange: (page: WorkspacePage) => void }): React.JSX.Element {
  return (
    <nav className="flex w-[76px] shrink-0 flex-col items-center border-r border-white/[0.065] bg-[#090c11] py-4">
      <div className="mb-6 flex size-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.08]"><Blocks className="size-4.5 text-sky-300" /></div>
      <div className="flex flex-1 flex-col gap-2">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" className={cn('group flex w-[62px] flex-col items-center gap-1.5 rounded-xl py-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] transition', activePage === id ? 'bg-sky-400/[0.1] text-sky-200' : 'text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300')} onClick={() => onChange(id)}>
            <Icon className="size-4.5" />{label}
          </button>
        ))}
      </div>
      <button type="button" className={cn('group flex w-[62px] flex-col items-center gap-1.5 rounded-xl py-2.5 text-[9px] font-semibold uppercase tracking-[0.08em] transition', activePage === 'settings' ? 'bg-sky-400/[0.1] text-sky-200' : 'text-zinc-600 hover:bg-white/[0.035] hover:text-zinc-300')} onClick={() => onChange('settings')}><Settings2 className="size-4.5" />Settings</button>
    </nav>
  )
}

