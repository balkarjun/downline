/* Electron Main Process */
const { app, BrowserWindow } = require('electron');

let win = null;
let url = 'http://localhost:8080/';

app.on('ready', () => {
  win = new BrowserWindow({
    width: 600,
    height: 550,
    frame: false,
    show: false
  });

  win.loadURL(url);
  win.once('ready-to-show', () => win.show());
  win.on('closed', () => win = null);
});

app.on('window-all-closed', () => app.quit());