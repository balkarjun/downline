/* Main Electron Process */
const { app, BrowserWindow } = require('electron');
const path = require('path');

let win = null;

let url;
if(process.env.NODE_ENV === 'DEV'){
  // URL of development server
  url = 'http://127.0.0.1:5500/src/index.html';
} else {
  url = path.join('file:', __dirname, 'index.html');
}

app.on('ready', () => {
  win = new BrowserWindow({
    width: 480,
    height: 625,
    minWidth: 420,
    minHeight: 500,
    frame: false,
    show: false,
    icon: path.join(__dirname, '../static/images/icon.png')
  });
  win.loadURL(url);

  win.once('ready-to-show', () => win.show());

  win.on('closed', () => win = null);
});

app.on('window-all-closed', () => app.quit());
