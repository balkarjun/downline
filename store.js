/* Data Persistence */
const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store{
  constructor(name, defaults){
    // Renderer process gets 'app' via 'remote' while Main process can get it directly
    // app.getPath('userData') returns a path to the user's app data directory
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');

    this.path = path.join(userDataPath, name + '.json');
    
    this.data = this._parseData(defaults);
  }

  // Retrieve value stored in 'key'
  get(key){
    return this.data[key];
  }

  // Store data
  set(key, val){
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }

  _parseData(defaults){
    // If file exists, parse and return data, else return passed in defaults
    try{
      return JSON.parse(fs.readFileSync(this.path));
    } catch (err) {
      return defaults;
    }
  }
}

module.exports = Store;