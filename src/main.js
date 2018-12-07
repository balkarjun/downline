/* Main Electron Process */

const { app, BrowserWindow } = require('electron');
const path = require('path');
let win = null;

app.on('ready', () => {
  win = new BrowserWindow({
    width: 490,
    height: 625,
    frame: false,
    show: false,
    icon: path.join(__dirname, '../build/256x256.png')
  });
  // win.loadURL('http://127.0.0.1:5500/');
  win.loadURL(path.join('file:', __dirname, 'index.html'));

  win.once('ready-to-show', () => win.show());

  win.on('closed', () => win = null);
});

app.on('window-all-closed', () => app.quit());
