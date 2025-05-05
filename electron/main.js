const { app, BrowserWindow } = require('electron')
const path = require('path')

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    })

    // Carga el frontend en desarrollo/producción
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000')
        win.webContents.openDevTools()
    } else {
        win.loadFile(path.join(__dirname, 'build', 'index.html'))
    }
}

app.whenReady().then(createWindow)