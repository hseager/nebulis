import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Preference from './types/Preference'
import RequestType from './types/RequestType'
import ytdl from 'ytdl-core'
import fs from 'fs-extra'
import * as path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import binaries from 'ffmpeg-static'

const initIpcEvents = (win: BrowserWindow) => {
  ipcMain.handle(RequestType.UpdateLibraryFolder, () => {
    return new Promise((resolve, reject) => {
      try {
        dialog
          .showOpenDialog(win, {
            properties: ['openDirectory'],
          })
          .then(({ canceled, filePaths }) => {
            if (!canceled) resolve(filePaths)
          })
          .catch((error) => reject(error))
      } catch (error) {
        reject(error)
      }
    })
  })

  ipcMain.handle(RequestType.GetPreference, (event: Event, preference: Preference) => {
    return new Promise((resolve, reject) => {
      try {
        switch (preference) {
          case Preference.LibraryFolder:
            resolve(app.getPath('downloads'))
            break
        }
      } catch (error) {
        reject(error)
      }
    })
  })

  ipcMain.handle(RequestType.GetVideoInfo, (event: Event, youTubeUrl: string) => {
    return new Promise((resolve, reject) => {
      try {
        ytdl.getBasicInfo(youTubeUrl).then(resolve).catch(reject)
      } catch (error) {
        reject(error)
      }
    })
  })

  ipcMain.handle(RequestType.Download, (event: Event, { youTubeUrl, libraryFolder, videoId }: { youTubeUrl: string; libraryFolder: string; videoId: string }) => {
    return new Promise((resolve, reject) => {
      try {
        downloadMp4Video(youTubeUrl, libraryFolder, videoId)
          .then((tempMp4Path: any) => convertMp4ToMp3(tempMp4Path, libraryFolder, videoId))
          .then((tempMp4Path: any) => fs.unlinkSync(tempMp4Path))
          .then(resolve)
          .catch(reject)
      } catch (error) {
        reject(error)
      }
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

const convertMp4ToMp3 = (tempMp4Path: string, libraryFolder: string, videoId: string) => {
  return new Promise((resolve, reject) => {
    try {
      ffmpeg(tempMp4Path)
        .setFfmpegPath(binaries)
        .format('mp3')
        .audioBitrate(128)
        .output(fs.createWriteStream(path.join(libraryFolder, `song-${videoId}.mp3`)))
        .on('end', () => resolve(tempMp4Path))
        .run()
    } catch (error) {
      reject(error)
    }
  })
}

export default initIpcEvents
