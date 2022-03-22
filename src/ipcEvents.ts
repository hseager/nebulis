import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Preference from './types/Preference'
import RequestType from './types/RequestType'
import ResponseType from './types/ResponseType'
import ytdl from 'ytdl-core'
import fs from 'fs-extra'
import * as path from 'path'

const initIpcEvents = (win: BrowserWindow) => {
  ipcMain.handle(RequestType.UpdateLibraryFolder, () => {
    return new Promise((resolve, reject) => {
      dialog
        .showOpenDialog(win, {
          properties: ['openDirectory'],
        })
        .then(({ canceled, filePaths }) => {
          if (!canceled) win.webContents.send(ResponseType.UpdateLibraryFolder, filePaths)
        })
        .catch((error) => reject(error))
    })
  })

  ipcMain.handle(RequestType.GetPreference, (event: Event, preference: Preference) => {
    switch (preference) {
      case Preference.LibraryFolder:
        win.webContents.send(ResponseType.UpdateLibraryFolder, app.getPath('downloads'))
        break
    }
  })

  ipcMain.handle(RequestType.GetVideoInfo, (event: Event, youTubeUrl: string) => {
    return new Promise((resolve, reject) => {
      ytdl
        .getBasicInfo(youTubeUrl)
        .then((response) => win.webContents.send(ResponseType.GetVideoInfo, response))
        .then(resolve)
        .catch(reject)
    })
  })

  ipcMain.handle(RequestType.Download, (event: Event, { youTubeUrl, libraryFolder, videoId }: { youTubeUrl: string; libraryFolder: string; videoId: string }) => {
    return new Promise((resolve, reject) => {
      downloadMp4Video(youTubeUrl, libraryFolder, videoId).then(resolve).catch(reject)
    })
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
