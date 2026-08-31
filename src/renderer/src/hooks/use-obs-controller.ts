import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ObsConnectionConfig, ObsLayoutSource, ObsState } from '../../../shared/obs'

const initialState: ObsState = {
  status: 'disconnected',
  endpoint: 'ws://127.0.0.1:4455',
  error: null,
  obsWebSocketVersion: null,
  negotiatedRpcVersion: null,
  reconnectAttempt: 0,
  currentProgramSceneName: null,
  currentPreviewSceneName: null,
  scenes: [],
  inputs: [],
  studioModeEnabled: false,
  streamActive: false,
  recordActive: false,
  currentTransitionName: null,
  transitionDuration: 300
}

export function useObsController() {
  const [state, setState] = useState<ObsState>(initialState)

  useEffect(() => {
    let active = true
    const unsubscribe = window.nasBroadcast.obs.onStateChanged((nextState) => {
      if (active) setState(nextState)
    })
    void window.nasBroadcast.obs.getState().then((nextState) => {
      if (active) setState(nextState)
    })
    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  const connect = useCallback(async (config: ObsConnectionConfig): Promise<ObsState> => {
    const nextState = await window.nasBroadcast.obs.connect(config)
    setState(nextState)
    return nextState
  }, [])

  const disconnect = useCallback(async (): Promise<void> => {
    setState(await window.nasBroadcast.obs.disconnect())
  }, [])

  const refresh = useCallback(async (): Promise<void> => {
    setState(await window.nasBroadcast.obs.refresh())
  }, [])

  const selectScene = useCallback(async (sceneName: string): Promise<void> => setState(await window.nasBroadcast.obs.selectScene(sceneName)), [])
  const take = useCallback(async (): Promise<void> => setState(await window.nasBroadcast.obs.take()), [])
  const setTransition = useCallback(async (name: string, duration: number): Promise<void> => setState(await window.nasBroadcast.obs.setTransition(name, duration)), [])
  const ensureGraphics = useCallback(async (endpoint: string): Promise<void> => setState(await window.nasBroadcast.obs.ensureGraphics(endpoint)), [])
  const applyLayout = useCallback(async (layoutName: string, sources: ObsLayoutSource[]): Promise<void> => setState(await window.nasBroadcast.obs.applyLayout(layoutName, sources)), [])

  return useMemo(
    () => ({
      state,
      connect,
      disconnect,
      refresh,
      selectScene,
      take,
      setTransition,
      ensureGraphics,
      applyLayout,
      isConnected: state.status === 'connected',
      isBusy: state.status === 'connecting' || state.status === 'reconnecting'
    }),
    [applyLayout, connect, disconnect, ensureGraphics, refresh, selectScene, setTransition, state, take]
  )
}

