import { contextBridge, ipcRenderer } from 'electron'
import { RequestType, ResponseType } from './types/types'

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
  receive: (channel: ResponseType, func: Function) => {
    let validChannels = Object.values(ResponseType)
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event: Event, ...args: any) => func(...args))
    } else {
      console.error(`Invalid ResponseType: ${channel}`)
    }
  },
})
