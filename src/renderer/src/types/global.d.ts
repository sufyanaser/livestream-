export {}

import type { ObsBridge } from '../../../shared/obs'

declare global {
  interface Window {
    nasBroadcast: {
      platform: NodeJS.Platform
      runtime: 'electron'
      obs: ObsBridge
    }
  }
}
