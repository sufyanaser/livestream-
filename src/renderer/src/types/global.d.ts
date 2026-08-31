export {}

import type { ObsBridge } from '../../../shared/obs'
import type { ProjectBridge } from '../../../shared/project'

declare global {
  interface Window {
    nasBroadcast: {
      platform: NodeJS.Platform
      runtime: 'electron'
      project: ProjectBridge
      obs: ObsBridge
    }
  }
}
