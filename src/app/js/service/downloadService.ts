import ytdl from '@distube/ytdl-core'
import * as path from 'path'
import fs from 'fs-extra'
import { BrowserWindow } from 'electron'
import ffmpeg from 'fluent-ffmpeg'
import { DirectorySettings, DownloadVideoRequest, MetaData, ResponseType } from '../types/types'

export class DownloadService {
  private static ffmpegBinaries = path.join(__dirname, 'ffmpeg.exe')
  private static isRateLimited = false
  private static rateLimitAmount = 50

  private static buildFolderPath = (directorySettings: DirectorySettings, metaData: MetaData) => {
    const { libraryFolder, includeArtistInFolderPath, includeAlbumInFolderPath } = directorySettings

    let folderPath = libraryFolder

    if (includeArtistInFolderPath && metaData.artist) {
      folderPath += `/${metaData.artist}`
    }
    if (includeAlbumInFolderPath && metaData.album) {
      folderPath += `/${metaData.album}`
    }

    return folderPath
  }

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
    const { youTubeUrl, filename, bitrate, metaData, directorySettings } = request
    const folderPath = this.buildFolderPath(directorySettings, metaData)

    return new Promise((resolve, reject) => {
      try {
        this.downloadMp4Video(win, youTubeUrl, folderPath, filename)
          .then((tempMp4Path: any) => this.convertMp4ToMp3(win, tempMp4Path, folderPath, bitrate, filename, metaData))
          .then((tempMp4Path: any) => fs.unlinkSync(tempMp4Path))
          .then(resolve)
          .catch(reject)
      } catch (error) {
        reject(error)
      }
    })
  }

  private static downloadMp4Video = (win: BrowserWindow, youTubeUrl: string, folderPath: string, filename: string) => {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)

        const fullPath = path.join(folderPath, `tmp_${filename}.mp4`)
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
        const { title, artist, album, albumArtist, genre, trackNumber } = metaData
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
          .outputOptions('-metadata', `track=${trackNumber}`)
          .output(fs.createWriteStream(path.join(libraryFolder, `${filename}.mp3`)))
          .on('end', () => resolve(tempMp4Path))
          .run()
      } catch (error) {
        reject(error)
      }
    })
  }
}
