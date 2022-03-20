import { app, BrowserWindow, dialog, ipcMain } from 'electron'
import path from 'path'
import RequestType from './types/RequestType'
import ResponseType from './types/ResponseType'

let win: BrowserWindow

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  win.loadFile('dist/index.html')
}

app.whenReady().then(() => {
  createWindow()

  // Open a window if none are open (macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

ipcMain.on(
  RequestType.ChangeDownloadFolder,
  (event: Event, something: string) => {
    win.webContents.send(ResponseType.ChangeDownloadFolder, something)
  }
)

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
