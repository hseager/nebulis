import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Preference from './types/Preference'
import RequestType from './types/RequestType'
import MetaData from './types/MetaData'
import ytdl from 'ytdl-core'
import fs from 'fs-extra'
import * as path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import binaries from 'ffmpeg-static'
import ResponseType from './types/ResponseType'

const initIpcEvents = (win: BrowserWindow) => {
  let isRateLimited = false
  const rateLimitAmount = 300

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

  ipcMain.handle(RequestType.Download, (event: Event, { youTubeUrl, libraryFolder, videoId, bitrate, filename, metaData }: { youTubeUrl: string; libraryFolder: string; videoId: string; bitrate: string; filename: string; metaData: MetaData }) => {
    return new Promise((resolve, reject) => {
      try {
        downloadMp4Video(youTubeUrl, libraryFolder, videoId, filename)
          .then((tempMp4Path: any) => convertMp4ToMp3(tempMp4Path, libraryFolder, videoId, bitrate, filename, metaData))
          .then((tempMp4Path: any) => fs.unlinkSync(tempMp4Path))
          .then(resolve)
          .catch(reject)
      } catch (error) {
        reject(error)
      }
    })
  })

  const downloadMp4Video = (youTubeUrl: string, libraryFolder: string, videoId: string, filename: string) => {
    return new Promise((resolve, reject) => {
      try {
        const fullPath = path.join(libraryFolder, `tmp_${filename}.mp4`)
        const videoDownload = ytdl(youTubeUrl, { filter: 'audioonly' })

        videoDownload.on('progress', (chunkLength, downloaded, total) => {
          if (!isRateLimited) {
            isRateLimited = true
            const progress = Math.floor((downloaded / total) * 100)
            setTimeout(() => {
              isRateLimited = false
              win.webContents.send(ResponseType.DownloadProgress, progress)
            }, rateLimitAmount)
          }
        })

        videoDownload.pipe(fs.createWriteStream(fullPath)).on('finish', () => {
          resolve(fullPath)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const convertMp4ToMp3 = (tempMp4Path: string, libraryFolder: string, videoId: string, bitrate: string, filename: string, metaData: MetaData) => {
    return new Promise((resolve, reject) => {
      try {
        const formattedMetaData = createMetaData(metaData)
        ffmpeg(tempMp4Path)
          .setFfmpegPath(binaries)
          .format('mp3')
          .audioBitrate(bitrate)
          .on('start', () => {
            win.webContents.send(ResponseType.ConversionProgress, true)
          })
          .outputOptions(formattedMetaData)
          .output(fs.createWriteStream(path.join(libraryFolder, `${filename}.mp3`)))
          .on('end', () => {
            win.webContents.send(ResponseType.ConversionProgress, false)
            resolve(tempMp4Path)
          })
          .run()
      } catch (error) {
        reject(error)
      }
    })
  }
}

const createMetaData = (metaData: MetaData) => {
  const formattedMetaData = []
  if (metaData.title) formattedMetaData.push(`-metadata title=${metaData.title}`)
  if (metaData.artist) formattedMetaData.push(`-metadata artist=${metaData.artist}`)
  if (metaData.album) formattedMetaData.push(`-metadata album=${metaData.artist}`)
  if (metaData.genre) formattedMetaData.push(`-metadata genre=${metaData.genre[0]}`)
  return formattedMetaData
}

export default initIpcEvents
