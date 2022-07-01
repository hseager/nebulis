import { BrowserWindow, ipcMain } from 'electron'
import 'regenerator-runtime/runtime'
import Preference from '../types/Preference'
import RequestType from '../types/RequestType'
import { LibraryService } from './libraryService'
import { PreferenceService } from './preferenceService'
import { DownloadService } from './downloadService'
import DownloadVideoRequest from '../types/DownloadVideoRequest'

const initIpcEvents = (win: BrowserWindow) => {
  // Library
  ipcMain.handle(RequestType.UpdateLibraryFolder, () => LibraryService.updateLibraryFolder(win))
  ipcMain.handle(RequestType.GetLibraryData, (event: Event, libraryFolder: string) => LibraryService.getLibraryData(libraryFolder))

  // Preferences
  ipcMain.handle(RequestType.GetPreference, (event: Event, preference: Preference) => PreferenceService.getPreference(preference))

  // Download
  ipcMain.handle(RequestType.GetVideoInfo, (event: Event, youTubeUrl: string) => DownloadService.getVideoInfo(youTubeUrl))
  ipcMain.handle(RequestType.DownloadVideo, (event: Event, request: DownloadVideoRequest) => DownloadService.downloadVideo(win, request))
}

export default initIpcEvents