import { app, BrowserWindow } from 'electron'
import path from 'path'
import initIpcEvents from './ipcEvents'

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

app
  .whenReady()
  .then(() => {
    createWindow()

    // Open a window if none are open (macOS)
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  .then(() => initIpcEvents(win))

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})
