import type { ProjectDocument } from '../../../../shared/project'
import type { ObsState } from '../../../../shared/obs'
import { LowerThirdPanel, TakeBar, TransitionPanel } from '@/components/broadcast/action-panels'
import { LayoutPanel, RundownPanel, SourcePanel } from '@/components/broadcast/control-panel'
import { Monitor } from '@/components/broadcast/monitor'

export function DirectorPage({ project, obsState, connected, onSceneSelect, onTake, onTransition }: { project: ProjectDocument; obsState: ObsState; connected: boolean; onSceneSelect: (name: string) => void; onTake: () => void; onTransition: (name: string) => void }): React.JSX.Element {
  const offlineInputs = project.sourceSlots.map((source) => ({ name: source.label, uuid: source.id, kind: source.role }))
  const offlineScenes = project.layouts.map((layout) => ({ name: layout.name, uuid: layout.id }))
  return (
    <main className="grid min-h-0 flex-1 grid-cols-[230px_minmax(540px,1fr)_245px] gap-3 p-3">
      <aside className="grid min-h-0 grid-rows-[minmax(260px,1fr)_auto] gap-3"><SourcePanel connected inputs={connected ? obsState.inputs : offlineInputs} scenes={connected ? obsState.scenes : offlineScenes} onSceneSelect={connected ? onSceneSelect : undefined} /><LayoutPanel /></aside>
      <section className="flex min-w-0 flex-col gap-3">
        <div className="grid grid-cols-2 gap-3"><Monitor label="PREVIEW" title={obsState.currentPreviewSceneName ?? 'Offline Preview'} signal={connected} /><Monitor label="PROGRAM" title={obsState.currentProgramSceneName ?? 'Offline Program'} live={connected} signal={connected} /></div>
        <div className="grid grid-cols-[1fr_300px] gap-3"><LowerThirdPanel /><TransitionPanel activeName={obsState.currentTransitionName} duration={obsState.transitionDuration} disabled={!connected} onSelect={onTransition} /></div>
        <div className="mt-auto"><TakeBar disabled={!connected || !obsState.studioModeEnabled} onTake={onTake} /></div>
      </section>
      <aside className="min-h-0"><RundownPanel /></aside>
    </main>
  )
}
