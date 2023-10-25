import ytdl from '@distube/ytdl-core'
import * as path from 'path'
import fs from 'fs-extra'
import { BrowserWindow } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import { DownloadVideoRequest, MetaData, ResponseType } from '../types/types'

export class DownloadService {
  private static ffmpegBinaries = path.join(__dirname, 'ffmpeg.exe')
  private static isRateLimited = false
  private static rateLimitAmount = 50

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
        if (!fs.existsSync(libraryFolder)) fs.mkdirSync(libraryFolder)

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
        const { title, artist, album, albumArtist, genre } = metaData
        ffmpeg(tempMp4Path)
          .setFfmpegPath(this.ffmpegBinaries)
          .format('mp3')
          .audioBitrate(bitrate)
          .on('progress', (progress) => win.webContents.send(ResponseType.ConversionProgress, Math.floor(progress.percent)))
          .outputOptions('-metadata', `title=${title}`)
          .outputOptions('-metadata', `artist=${artist}`)
          .outputOptions('-metadata', `album=${album}`)
          .outputOptions('-metadata', `album_artist=${albumArtist}`)
          .outputOptions('-metadata', `genre=${genre}`)
          .output(fs.createWriteStream(path.join(libraryFolder, `${filename}.mp3`)))
          .on('end', () => resolve(tempMp4Path))
          .run()
      } catch (error) {
        reject(error)
      }
    })
  }
}
