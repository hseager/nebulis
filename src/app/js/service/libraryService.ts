import { BrowserWindow, dialog } from 'electron'
import fs from 'fs-extra'
import * as path from 'path'
import Song from '../types/Song'
import ffmpeg from 'fluent-ffmpeg'

export class LibraryService {
  private static ffprobeBinaries = path.join(__dirname, 'ffprobe.exe')

  static updateLibraryFolder = (win: BrowserWindow) => {
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
  }

  static getLibraryData = (libraryFolder: string) => {
    return new Promise((resolve, reject) => {
      try {
        fs.readdir(libraryFolder, async (error, files) => {
          if (error) reject(error)

          const library = await this.getLibrary(files, libraryFolder)

          resolve(library)
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  private static getLibrary = async (files: string[], libraryFolder: string) => {
    const songs: Song[] = []

    for await (const filename of files) {
      const filePath = path.join(libraryFolder, filename)
      const song: Song = await this.getSongInfo(filePath, filename)
      songs.push(song)
    }

    return songs
  }

  private static getSongInfo = (filePath: string, filename: string): Promise<Song> => {
    return new Promise(async (resolve, reject) => {
      try {
        ffmpeg(filePath)
          .setFfprobePath(this.ffprobeBinaries)
          .ffprobe((error, data) => {
            if (error) reject(error)

            const { title, artist, album } = data.format.tags || {}

            const song: Song = {
              filename,
              title,
              artist,
              album,
            }

            resolve(song)
          })
      } catch (error) {
        reject(error)
      }
    })
  }
}
