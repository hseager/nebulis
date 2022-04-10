import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import Preference from './types/Preference'
import RequestType from './types/RequestType'
import MetaData from './types/MetaData'
import ytdl from 'ytdl-core'
import fs from 'fs-extra'
import * as path from 'path'
import ffmpeg from 'fluent-ffmpeg'
import ResponseType from './types/ResponseType'
import Song from './types/Song'

const ffmpegBinaries = path.join(__dirname, 'ffmpeg.exe')
const ffprobeBinaries = path.join(__dirname, 'ffprobe.exe')

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

  ipcMain.handle(RequestType.GetLibrary, (event: Event, libraryFolder: string) => {
    return new Promise((resolve, reject) => {
      try {
        fs.readdir(libraryFolder, async (error, files) => {
          if (error) reject(error)

          const songs: Song[] = []

          // for await (const file of files) {
          //   ffmpeg(path.join(libraryFolder, file))
          //     .setFfprobePath(ffprobeBinaries)
          //     .ffprobe((error, data) => {
          //       if (error) reject(error)

          //       const { title, artist, album } = data.format.tags || {}

          //       const song: Song = {
          //         filename: 'Test',
          //         title,
          //         artist,
          //         album,
          //       }
          //       songs.push(song)
          //     })
          // }

          resolve(songs)
        })
      } catch (error) {
        reject(error)
      }
    })
  })

  // const getLibrary = async (files: string[], libraryFolder: string) => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //     } catch (error) {
  //       reject(error)
  //     }
  //   })
  // }

  ipcMain.handle(
    RequestType.Download,
    (
      event: Event,
      {
        youTubeUrl,
        libraryFolder,
        bitrate,
        filename,
        metaData,
      }: { youTubeUrl: string; libraryFolder: string; bitrate: string; filename: string; metaData: MetaData }
    ) => {
      return new Promise((resolve, reject) => {
        try {
          downloadMp4Video(youTubeUrl, libraryFolder, filename)
            .then((tempMp4Path: any) => convertMp4ToMp3(tempMp4Path, libraryFolder, bitrate, filename, metaData))
            .then((tempMp4Path: any) => fs.unlinkSync(tempMp4Path))
            .then(resolve)
            .catch(reject)
        } catch (error) {
          reject(error)
        }
      })
    }
  )

  const downloadMp4Video = (youTubeUrl: string, libraryFolder: string, filename: string) => {
    return new Promise((resolve, reject) => {
      try {
        const fullPath = path.join(libraryFolder, `tmp_${filename}.mp4`)
        const videoDownload = ytdl(youTubeUrl, { filter: 'audioonly' })
        let progressTimeout: ReturnType<typeof setTimeout>

        videoDownload.on('progress', (chunkLength, downloaded, total) => {
          if (!isRateLimited) {
            isRateLimited = true
            const progress = Math.floor((downloaded / total) * 100)
            progressTimeout = setTimeout(() => {
              isRateLimited = false
              win.webContents.send(ResponseType.DownloadProgress, progress)
            }, rateLimitAmount)
          }
        })

        videoDownload.pipe(fs.createWriteStream(fullPath)).on('finish', () => {
          clearTimeout(progressTimeout)
          win.webContents.send(ResponseType.DownloadProgress, 100)
          resolve(fullPath)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  const convertMp4ToMp3 = (tempMp4Path: string, libraryFolder: string, bitrate: string, filename: string, metaData: MetaData) => {
    return new Promise((resolve, reject) => {
      try {
        ffmpeg(tempMp4Path)
          .setFfmpegPath(ffmpegBinaries)
          .format('mp3')
          .audioBitrate(bitrate)
          .on('start', () => {
            win.webContents.send(ResponseType.ConversionProgress, true)
          })
          .outputOptions('-metadata', `title=${metaData.title}`)
          .outputOptions('-metadata', `artist=${metaData.artist}`)
          .outputOptions('-metadata', `album=${metaData.album}`)
          .outputOptions('-metadata', `genre=${metaData.genre[0]}`)
          .output(fs.createWriteStream(path.join(libraryFolder, `${filename}.mp3`)))
          .on('end', () => {
            win.webContents.send(ResponseType.ConversionProgress, false)
            win.webContents.send(ResponseType.DownloadProgress, 0)
            resolve(tempMp4Path)
          })
          .run()
      } catch (error) {
        reject(error)
      }
    })
  }
}

export default initIpcEvents
