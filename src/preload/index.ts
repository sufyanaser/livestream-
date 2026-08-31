import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('nasBroadcast', {
  platform: process.platform,
  runtime: 'electron'
})

