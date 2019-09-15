const electron = require('electron');
const { join } = require('path');
const fs = require('fs');

const defaults = {};
const userDataPath = (electron.app || electron.remote.app).getPath('userData');
const path = join(userDataPath, 'settings.json');

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

module.exports = { get, set, update };