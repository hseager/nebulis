import { contextBridge, ipcRenderer } from 'electron'
import RequestType from './types/RequestType'
import ResponseType from './types/ResponseType'

contextBridge.exposeInMainWorld('api', {
  send: (channel: RequestType, data: any) => {
    let validChannels = Object.values(RequestType)
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    } else {
      console.error(`Invalid RequestType: ${channel}`)
    }
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
