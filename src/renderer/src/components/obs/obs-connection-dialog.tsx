import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff, RadioTower, X } from 'lucide-react'
import type { ObsConnectionConfig, ObsState } from '../../../../shared/obs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ObsConnectionDialogProps {
  open: boolean
  state: ObsState
  onClose: () => void
  onConnect: (config: ObsConnectionConfig) => Promise<ObsState>
  onDisconnect: () => Promise<void>
}

export function ObsConnectionDialog({ open, state, onClose, onConnect, onDisconnect }: ObsConnectionDialogProps): React.JSX.Element | null {
  const [endpoint, setEndpoint] = useState(state.endpoint)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  useEffect(() => {
    if (open) setEndpoint(state.endpoint)
  }, [open, state.endpoint])

  if (!open) return null

  const handleSubmit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setValidationError(null)
    try {
      const nextState = await onConnect({ endpoint, password })
      if (nextState.status === 'connected') {
        setPassword('')
        onClose()
      }
    } catch (error) {
      setValidationError(error instanceof Error ? error.message : 'Connection request failed')
    }
  }

  const isBusy = state.status === 'connecting' || state.status === 'reconnecting'
  const error = validationError ?? state.error

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
      <section className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#11151c] shadow-[0_28px_100px_rgba(0,0,0,.7)]" role="dialog" aria-modal="true" aria-labelledby="obs-dialog-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-400/[0.08]"><RadioTower className="size-4 text-sky-300" /></div>
            <div><h2 id="obs-dialog-title" className="text-sm font-semibold">OBS WebSocket</h2><p className="mt-0.5 text-[11px] text-zinc-500">Connection stays in memory for this session</p></div>
          </div>
          <Button aria-label="Close" size="icon" variant="ghost" onClick={onClose}><X className="size-4" /></Button>
        </header>

        {state.status === 'connected' ? (
          <div className="space-y-4 p-5">
            <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/[0.045] p-4">
              <div className="flex items-center justify-between"><span className="text-xs font-medium text-zinc-200">Connected</span><Badge tone="ready">Online</Badge></div>
              <p className="mt-2 font-mono text-[11px] text-zinc-500">{state.endpoint}</p>
              <p className="mt-1 text-[10px] text-zinc-600">OBS WebSocket {state.obsWebSocketVersion ?? 'unknown'} · RPC {state.negotiatedRpcVersion ?? '—'}</p>
            </div>
            <Button className="w-full" variant="danger" onClick={() => void onDisconnect()}>Disconnect from OBS</Button>
          </div>
        ) : (
          <form className="space-y-4 p-5" onSubmit={(event) => void handleSubmit(event)}>
            <label className="block space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">WebSocket endpoint</span>
              <input className="obs-input" value={endpoint} onChange={(event) => setEndpoint(event.target.value)} placeholder="ws://127.0.0.1:4455" autoComplete="off" spellCheck={false} />
            </label>
            <label className="block space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Password</span>
              <span className="relative block">
                <input className="obs-input pr-11" type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Optional" autoComplete="off" />
                <button className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-600 hover:text-zinc-300" type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </span>
            </label>
            {error && <p className="rounded-lg border border-red-400/15 bg-red-500/[0.06] px-3 py-2.5 text-[11px] text-red-300">{error}</p>}
            <Button className="w-full" disabled={isBusy} type="submit">{isBusy ? `Reconnecting · attempt ${state.reconnectAttempt}` : 'Connect to OBS'}</Button>
          </form>
        )}
      </section>
    </div>
  )
}

