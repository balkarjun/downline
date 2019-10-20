const electron = require('electron');
const { join } = require('path');
const fs = require('fs');

const defaults = {
  downloadLocation: '../',
  simultaneous: 5,
  filenameFormats: [
    { key: '%(title)s.%(ext)s', name: 'Title' },
    { key: '%(id)s.%(ext)s', name: 'ID' },
    { key: '%(title)s-%(id)s.%(ext)s', name: 'Title + ID' }
  ],
  filenameIndex: 0,
  audioFormats: ['mp3', 'wav', 'aac', 'flac', 'opus', 'vorbis'],
  audioIndex: 0,
  videoFormats: ['default', 'mp4', 'webm', 'mkv'],
  videoIndex: 0,
  ascii: false,
  autonumber: false,
  downloadables: []
};

const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const path = join(userDataPath, 'storev2.json');

let data = defaults;
if (fs.existsSync(path)) {
  data = JSON.parse(fs.readFileSync(path));
}

function get(key) {
  return data[key];
}

function set(key, val) {
  data[key] = val;
}

function update() {
  fs.writeFileSync(path, JSON.stringify(data));
}

export default { get, set, update };
