const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  send: (channel: string, data: any) => {
    let validChannels = ['change-directory-request']
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data)
    }
  },
  receive: (channel: string, func: Function) => {
    let validChannels = ['change-directory-response']
    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, (event: any, ...args: any) => func(...args))
    }
  },
})
