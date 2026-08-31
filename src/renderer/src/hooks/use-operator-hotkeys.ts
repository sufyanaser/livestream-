import { useEffect } from 'react'
import type { WorkspacePage } from '@/components/layout/workspace-sidebar'

export function useOperatorHotkeys(onNavigate: (page: WorkspacePage) => void, onSave: () => Promise<void>): void {
  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      const command = event.ctrlKey || event.metaKey
      if (!command) return
      const pages: Record<string, WorkspacePage> = { '1': 'director', '2': 'layouts', '3': 'graphics', '4': 'rundown', '5': 'guests', '6': 'macros' }
      if (pages[event.key]) { event.preventDefault(); onNavigate(pages[event.key]); return }
      if (event.key.toLowerCase() === 's') { event.preventDefault(); void onSave() }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onNavigate, onSave])
}
