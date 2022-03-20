import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Preference from './types/Preference'
import RequestType from './types/RequestType'
import ResponseType from './types/ResponseType'
import ytdl from 'ytdl-core'
import fs from 'fs-extra'
import * as path from 'path'

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

  ipcMain.on(RequestType.GetVideoInfo, (event: Event, youTubeUrl: string) => {
    try {
      ytdl.getBasicInfo(youTubeUrl).then((response) => win.webContents.send(ResponseType.GetVideoInfo, response))
    } catch (error) {
      console.log(error)
    }
  })

  ipcMain.on(RequestType.DownloadVideo, (event: Event, { youTubeUrl, downloadFolder, videoId }: { youTubeUrl: string; downloadFolder: string; videoId: string }) => {
    const fullPath = path.join(downloadFolder, `tmp_${videoId}.mp4`)
    const videoDownload = ytdl(youTubeUrl, { filter: 'audioonly' })

    videoDownload.pipe(fs.createWriteStream(fullPath)).on('finish', () => console.log('Finished!'))
  })
}

export default initIpcEvents
