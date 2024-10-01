import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron'
import 'regenerator-runtime/runtime'
import { PreferenceService } from './preferenceService'
import { DownloadService } from './downloadService'
import { DownloadVideoRequest, Preference, RequestType } from '../types/types'
import { LibraryService } from './libraryService'

const initIpcEvents = (win: BrowserWindow) => {
  // Library
  ipcMain.handle(RequestType.UpdateLibraryFolder, () => LibraryService.updateLibraryFolder(win))

  // Preferences
  ipcMain.handle(RequestType.GetPreference, (event: IpcMainInvokeEvent, preference: Preference) =>
    PreferenceService.getPreference(preference)
  )

  // Download
  ipcMain.handle(RequestType.GetVideoInfo, (event: IpcMainInvokeEvent, youTubeUrl: string) => DownloadService.getVideoInfo(youTubeUrl))
  ipcMain.handle(RequestType.DownloadVideo, (event: IpcMainInvokeEvent, request: DownloadVideoRequest) =>
    DownloadService.downloadVideo(win, request)
  )
}

export default initIpcEvents
