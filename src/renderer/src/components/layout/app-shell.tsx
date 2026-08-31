import { useState } from 'react'
import { Activity, CircleDot, Clock3, RadioTower, Save, Wifi, WifiOff } from 'lucide-react'
import { WorkspaceSidebar, type WorkspacePage } from '@/components/layout/workspace-sidebar'
import { ObsConnectionDialog } from '@/components/obs/obs-connection-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DirectorPage } from '@/features/director/director-page'
import { GraphicsPage } from '@/features/graphics/graphics-page'
import { GuestsPage } from '@/features/guests/guests-page'
import { LayoutsPage } from '@/features/layouts/layouts-page'
import { MacrosPage } from '@/features/macros/macros-page'
import { RundownPage } from '@/features/rundown/rundown-page'
import { SettingsPage } from '@/features/settings/settings-page'
import { useObsController } from '@/hooks/use-obs-controller'
import { useProject } from '@/state/project-context'

export function AppShell(): React.JSX.Element {
  const [activePage, setActivePage] = useState<WorkspacePage>('director')
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false)
  const obs = useObsController()
  const { project, saveStatus, updateProject, saveNow } = useProject()

  if (!project) return <div className="flex min-h-screen items-center justify-center bg-[#07090d] text-xs uppercase tracking-[0.2em] text-zinc-600">Loading broadcast workspace…</div>

  const statusLabel = obs.state.status === 'connected' ? 'OBS Online' : obs.state.status === 'reconnecting' ? `OBS Retry ${obs.state.reconnectAttempt}` : obs.state.status === 'connecting' ? 'OBS Connecting' : 'Offline workspace'
  const page = (() => {
    switch (activePage) {
      case 'layouts': return <LayoutsPage project={project} updateProject={updateProject} />
      case 'graphics': return <GraphicsPage project={project} />
      case 'rundown': return <RundownPage project={project} updateProject={updateProject} />
      case 'guests': return <GuestsPage project={project} updateProject={updateProject} />
      case 'macros': return <MacrosPage project={project} updateProject={updateProject} />
      case 'settings': return <SettingsPage project={project} updateProject={updateProject} />
      default: return <DirectorPage project={project} obsState={obs.state} connected={obs.isConnected} />
    }
  })()

  return (
    <div className="flex min-h-screen bg-[#07090d] text-zinc-100">
      <WorkspaceSidebar activePage={activePage} onChange={setActivePage} />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="app-drag-region flex h-16 shrink-0 items-center justify-between border-b border-white/[0.065] bg-[#0b0e13]/90 px-5 backdrop-blur-xl">
          <div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.08]"><RadioTower className="size-4.5 text-sky-300" /></div><div><h1 className="text-sm font-semibold tracking-[0.02em]">{project.name}</h1><p className="mt-0.5 text-[10px] uppercase tracking-[0.17em] text-zinc-600">NAS Broadcast Director · V1 Workspace</p></div></div>
          <div className="app-no-drag flex items-center gap-2">
            <Button variant="ghost" onClick={() => void saveNow()}><Save className="size-3.5" />{saveStatus === 'saving' ? 'Saving…' : saveStatus === 'error' ? 'Save error' : 'Saved'}</Button>
            <Badge tone={obs.isConnected ? 'ready' : obs.isBusy ? 'warning' : 'neutral'}>{obs.isConnected ? <Wifi className="mr-1.5 size-3" /> : <WifiOff className="mr-1.5 size-3" />}{statusLabel}</Badge>
            <Button variant="ghost" onClick={() => setConnectionDialogOpen(true)}><CircleDot className={obs.isConnected ? 'size-3.5 text-emerald-400' : 'size-3.5 text-zinc-600'} />{obs.isConnected ? 'OBS Details' : 'OBS later'}</Button>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">{page}</div>
        <footer className="flex h-9 shrink-0 items-center justify-between border-t border-white/[0.06] bg-[#0a0d12] px-4 text-[10px] text-zinc-600"><div className="flex items-center gap-4"><span className="flex items-center gap-1.5"><Activity className="size-3" />{project.layouts.length} layouts · {project.graphicTemplates.length} graphics · {project.rundown.length} cues</span><span>{project.canvas.width}×{project.canvas.height}</span><span>{project.canvas.fps} FPS</span></div><div className="flex items-center gap-1.5 font-mono"><Clock3 className="size-3" /><span>{window.nasBroadcast.platform === 'darwin' ? 'macOS' : 'Windows'}</span></div></footer>
      </div>
      <ObsConnectionDialog open={connectionDialogOpen} state={obs.state} onClose={() => setConnectionDialogOpen(false)} onConnect={obs.connect} onDisconnect={obs.disconnect} />
    </div>
  )
}
