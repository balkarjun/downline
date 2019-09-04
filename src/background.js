/* Electron Main Process */
const { app, BrowserWindow } = require('electron');

let win = null;
let url = 'http://localhost:8080/';

app.on('ready', () => {
  win = new BrowserWindow({
    width: 850,
    height: 520,
    frame: false,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.webContents.openDevTools();
  win.loadURL(url);
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => win = null);
});

app.on('window-all-closed', () => app.quit());