import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Preference from './types/Preference'
import RequestType from './types/RequestType'
import ResponseType from './types/ResponseType'

const initIpcEvents = (win: BrowserWindow) => {
  ipcMain.on(RequestType.UpdateDownloadFolder, () => {
    dialog
      .showOpenDialog(win, {
        properties: ['openDirectory'],
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) win.webContents.send(ResponseType.UpdateDownloadFolder, filePaths)
      })
      .catch((error) => console.error(error))
  })

  ipcMain.on(RequestType.GetPreference, (event: Event, preference: Preference) => {
    switch (preference) {
      case Preference.DownloadFolder:
        win.webContents.send(ResponseType.UpdateDownloadFolder, app.getPath('downloads'))
        break
    }
  })
}

export default initIpcEvents
