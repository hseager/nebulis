import ytdl from 'ytdl-core'
import * as path from 'path'
import fs from 'fs-extra'
import { BrowserWindow } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import ResponseType from '../types/ResponseType'
import DownloadVideoRequest from '../types/DownloadVideoRequest'
import MetaData from '../types/MetaData'

export class DownloadService {
  static ffmpegBinaries = path.join(__dirname, 'ffmpeg.exe')
  static isRateLimited = false
  static rateLimitAmount = 300

  static getVideoInfo = (youTubeUrl: string) => {
    return new Promise((resolve, reject) => {
      try {
        ytdl.getBasicInfo(youTubeUrl).then(resolve).catch(reject)
      } catch (error) {
        reject(error)
      }
    })
  }

  static downloadVideo = (win: BrowserWindow, request: DownloadVideoRequest) => {
    const { youTubeUrl, libraryFolder, filename, bitrate, metaData } = request
    return new Promise((resolve, reject) => {
      try {
        this.downloadMp4Video(win, youTubeUrl, libraryFolder, filename)
          .then((tempMp4Path: any) => this.convertMp4ToMp3(win, tempMp4Path, libraryFolder, bitrate, filename, metaData))
          .then((tempMp4Path: any) => fs.unlinkSync(tempMp4Path))
          .then(resolve)
          .catch(reject)
      } catch (error) {
        reject(error)
      }
    })
  }

  private static downloadMp4Video = (win: BrowserWindow, youTubeUrl: string, libraryFolder: string, filename: string) => {
    return new Promise((resolve, reject) => {
      try {
        const fullPath = path.join(libraryFolder, `tmp_${filename}.mp4`)
        const videoDownload = ytdl(youTubeUrl, { filter: 'audioonly' })
        let progressTimeout: ReturnType<typeof setTimeout>

        videoDownload.on('progress', (chunkLength, downloaded, total) => {
          if (!this.isRateLimited) {
            this.isRateLimited = true
            const progress = Math.floor((downloaded / total) * 100)
            progressTimeout = setTimeout(() => {
              this.isRateLimited = false
              win.webContents.send(ResponseType.DownloadProgress, progress)
            }, this.rateLimitAmount)
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

  private static convertMp4ToMp3 = (
    win: BrowserWindow,
    tempMp4Path: string,
    libraryFolder: string,
    bitrate: string,
    filename: string,
    metaData: MetaData
  ) => {
    return new Promise((resolve, reject) => {
      try {
        ffmpeg(tempMp4Path)
          .setFfmpegPath(this.ffmpegBinaries)
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