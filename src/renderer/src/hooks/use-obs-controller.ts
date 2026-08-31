import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ObsConnectionConfig, ObsState } from '../../../shared/obs'

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
  inputs: []
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

  return useMemo(
    () => ({
      state,
      connect,
      disconnect,
      refresh,
      isConnected: state.status === 'connected',
      isBusy: state.status === 'connecting' || state.status === 'reconnecting'
    }),
    [connect, disconnect, refresh, state]
  )
}

