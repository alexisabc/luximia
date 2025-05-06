const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    // Modo desarrollo: carga Next.js (localhost:3000)
    if (process.env.NODE_ENV === 'development') {
        win.loadURL('http://localhost:3000');
        win.webContents.openDevTools(); // Opcional: abre DevTools
    } else {
        // Modo producción: carga el build estático
        win.loadFile(path.join(__dirname, '../frontend/out/index.html'));
    }
}

app.whenReady().then(createWindow);
