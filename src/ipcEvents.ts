import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Preference from './types/Preference'
import RequestType from './types/RequestType'
import ResponseType from './types/ResponseType'
import ytdl from 'ytdl-core'
import fs from 'fs-extra'
import * as path from 'path'

const initIpcEvents = (win: BrowserWindow) => {
  ipcMain.on(RequestType.UpdateLibraryFolder, () => {
    dialog
      .showOpenDialog(win, {
        properties: ['openDirectory'],
      })
      .then(({ canceled, filePaths }) => {
        if (!canceled) win.webContents.send(ResponseType.UpdateLibraryFolder, filePaths)
      })
      .catch((error) => console.error(error))
  })

  ipcMain.on(RequestType.GetPreference, (event: Event, preference: Preference) => {
    switch (preference) {
      case Preference.LibraryFolder:
        win.webContents.send(ResponseType.UpdateLibraryFolder, app.getPath('downloads'))
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

  // TODO: make response class that handles errors and data
  ipcMain.on(RequestType.DownloadVideo, (event: Event, { youTubeUrl, libraryFolder, videoId }: { youTubeUrl: string; libraryFolder: string; videoId: string }) => {
    downloadMp4Video(youTubeUrl, libraryFolder, videoId)
      .then((folder) => console.log(folder))
      .catch((error) => console.log(error))
  })
}

const downloadMp4Video = (youTubeUrl: string, libraryFolder: string, videoId: string) => {
  return new Promise((resolve, reject) => {
    try {
      const fullPath = path.join(libraryFolder, `tmp_${videoId}.mp4`)
      const videoDownload = ytdl(youTubeUrl, { filter: 'audioonly' })

      videoDownload.pipe(fs.createWriteStream(fullPath)).on('finish', () => resolve(fullPath))
    } catch (error) {
      reject(error)
    }
  })
}

export default initIpcEvents
