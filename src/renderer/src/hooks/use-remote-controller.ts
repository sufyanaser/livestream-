import { useCallback, useEffect, useState } from 'react'
import type { RemoteState } from '../../../shared/remote'

const initialState: RemoteState = { enabled: false, port: 4457, directorUrl: null, operatorUrl: null, viewerUrl: null, connectedClients: 0 }
export function useRemoteController() {
  const [state, setState] = useState(initialState)
  useEffect(() => { let active = true; const unsubscribe = window.nasBroadcast.remote.onChanged((next) => { if (active) setState(next) }); void window.nasBroadcast.remote.get().then((next) => { if (active) setState(next) }); return () => { active = false; unsubscribe() } }, [])
  const enable = useCallback(async (): Promise<void> => setState(await window.nasBroadcast.remote.enable()), [])
  const disable = useCallback(async (): Promise<void> => setState(await window.nasBroadcast.remote.disable()), [])
  return { state, enable, disable }
}
