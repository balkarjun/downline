/* Main Electron Process */
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow = null;
let isSaved = false;

const url = process.env.NODE_ENV === 'DEV'
  ? 'http://127.0.0.1:5500/src/index.html'
  : path.join('file:', __dirname, 'index.html');

app.on('ready', () => {
  mainWindow = new BrowserWindow({
    width: 470,
    height: 530,
    minWidth: 420,
    minHeight: 500,
    frame: false,
    show: false,
    icon: path.join(__dirname, '../static/images/icon.png')
  });
  mainWindow.loadURL(url);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  mainWindow.on('close', event => {
    if (!isSaved) {
      event.preventDefault();
      mainWindow.webContents.send('save');
    }
  });

  mainWindow.on('closed', () => mainWindow = null);
});

app.on('window-all-closed', () => app.quit());

ipcMain.on('quit', () => {
  isSaved = true;
  app.quit();
});