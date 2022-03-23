import { contextBridge, ipcRenderer } from 'electron'
import RequestType from './types/RequestType'

contextBridge.exposeInMainWorld('api', {
  send: (channel: RequestType, data: any) => {
    return new Promise((resolve, reject) => {
      try {
        let validChannels = Object.values(RequestType)
        if (validChannels.includes(channel)) {
          ipcRenderer.invoke(channel, data).then(resolve).catch(reject)
        } else {
          reject(new Error(`Invalid RequestType: ${channel}`))
        }
      } catch (error) {
        reject(error)
      }
    })
  },
})
