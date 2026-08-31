import { Plus, Search, UserRound } from 'lucide-react'
import type { Guest, ProjectDocument } from '../../../../shared/project'
import { Button } from '@/components/ui/button'
import { Panel } from '@/components/ui/panel'

export function GuestsPage({ project, updateProject }: { project: ProjectDocument; updateProject: (updater: (project: ProjectDocument) => ProjectDocument) => void }): React.JSX.Element {
  const addGuest = (): void => {
    const guest: Guest = { id: crypto.randomUUID(), name: 'New guest', title: 'Title', organization: 'Organization', locale: 'ar', notes: '' }
    updateProject((current) => ({ ...current, guests: [...current.guests, guest] }))
  }
  return <div className="page-shell"><div className="page-heading"><div><span className="eyebrow">People database</span><h2>Guests & Speakers</h2><p>Prepare names, titles, and organizations before going live.</p></div><Button onClick={addGuest}><Plus className="size-4" />Add guest</Button></div><Panel className="min-h-0 flex-1"><div className="flex h-14 items-center border-b border-white/[0.06] px-4"><Search className="mr-2 size-4 text-zinc-600" /><input className="w-full bg-transparent text-xs text-zinc-300 outline-none" placeholder="Search guests" /></div><div className="divide-y divide-white/[0.05]">{project.guests.map((guest) => <div key={guest.id} className="grid grid-cols-[48px_1fr_1fr_120px] items-center gap-4 px-4 py-3"><div className="flex size-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03]"><UserRound className="size-4 text-zinc-500" /></div><div><strong className="block text-xs font-medium text-zinc-200">{guest.name}</strong><span className="mt-1 block text-[10px] text-zinc-600">{guest.title}</span></div><span className="text-xs text-zinc-500">{guest.organization}</span><span className="text-right text-[10px] uppercase tracking-wider text-zinc-600">{guest.locale}</span></div>)}{project.guests.length === 0 && <div className="flex h-60 flex-col items-center justify-center text-center"><UserRound className="mb-3 size-7 text-zinc-700" /><p className="text-xs text-zinc-500">No guests prepared yet</p><p className="mt-1 text-[10px] text-zinc-700">Add speakers before building the rundown.</p></div>}</div></Panel></div>
}

