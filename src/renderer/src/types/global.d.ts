export {}

declare global {
  interface Window {
    nasBroadcast: {
      platform: NodeJS.Platform
      runtime: 'electron'
    }
  }
}

