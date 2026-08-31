export {}

import type { ObsBridge } from '../../../shared/obs'
import type { ProjectBridge } from '../../../shared/project'
import type { GraphicsBridge } from '../../../shared/graphics'
import type { RemoteBridge } from '../../../shared/remote'

declare global {
  interface Window {
    nasBroadcast: {
      platform: NodeJS.Platform
      runtime: 'electron'
      project: ProjectBridge
      graphics: GraphicsBridge
      remote: RemoteBridge
      obs: ObsBridge
    }
  }
}
