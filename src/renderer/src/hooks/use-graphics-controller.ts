import { useCallback, useEffect, useState } from 'react'
import type { GraphicsPatch, GraphicsState } from '../../../shared/graphics'

const initialState: GraphicsState = {
  endpoint: '', revision: 0,
  lowerThird: { visible: false, name: '', title: '', organization: '', accentColor: '#38bdf8', direction: 'rtl', autoHideSeconds: 8 },
  ticker: { visible: false, text: '', direction: 'rtl', speed: 18 },
  clock: { visible: false, mode: 'clock', targetTime: null },
  logoVisible: false, sponsorVisible: false
}

export function useGraphicsController() {
  const [state, setState] = useState<GraphicsState>(initialState)
  useEffect(() => {
    let active = true
    const unsubscribe = window.nasBroadcast.graphics.onChanged((next) => { if (active) setState(next) })
    void window.nasBroadcast.graphics.get().then((next) => { if (active) setState(next) })
    return () => { active = false; unsubscribe() }
  }, [])
  const update = useCallback(async (patch: GraphicsPatch): Promise<void> => setState(await window.nasBroadcast.graphics.update(patch)), [])
  return { state, update }
}
