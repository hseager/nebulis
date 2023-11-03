import { BrowserWindow, ipcMain } from 'electron'
import 'regenerator-runtime/runtime'
import { PreferenceService } from './preferenceService'
import { DownloadService } from './downloadService'
import { DownloadVideoRequest, Preference, RequestType } from '../types/types'
import { LibraryService } from './libraryService'

const initIpcEvents = (win: BrowserWindow) => {
  // Library
  ipcMain.handle(RequestType.UpdateLibraryFolder, () => LibraryService.updateLibraryFolder(win))

  // Preferences
  ipcMain.handle(RequestType.GetPreference, (event: Event, preference: Preference) => PreferenceService.getPreference(preference))

  // Download
  ipcMain.handle(RequestType.GetVideoInfo, (event: Event, youTubeUrl: string) => DownloadService.getVideoInfo(youTubeUrl))
  ipcMain.handle(RequestType.DownloadVideo, (event: Event, request: DownloadVideoRequest) => DownloadService.downloadVideo(win, request))
}

export default initIpcEvents
