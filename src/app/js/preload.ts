import { contextBridge, ipcRenderer } from 'electron'
import { API, RequestType, ResponseType } from './types/types'

const api: API = {
  send: (channel: RequestType, data: unknown) => {
    return new Promise((resolve, reject) => {
      try {
        let validChannels = Object.values(RequestType)
        if (validChannels.includes(channel)) {
          ipcRenderer.invoke(channel, data).then(resolve).catch(reject)
        } else {
          reject(new Error(`Invalid RequestType when sending request: ${channel}`))
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
      console.error(`Invalid ResponseType when receiving response: ${channel}`)
    }
  },
  cleanup: (channel: ResponseType) => {
    let validChannels = Object.values(ResponseType)
    if (validChannels.includes(channel)) {
      ipcRenderer.removeAllListeners(channel)
    } else {
      console.error(`Invalid ResponseType when cleaning up: ${channel}`)
    }
  },
}

contextBridge.exposeInMainWorld('api', api)
