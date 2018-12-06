const YTDL = require('../ytdl.js');
const ytdl = new YTDL();
const Store = require('../store.js');

const { clipboard, remote } = require('electron');
const { dialog, app } = remote;

const store = new Store('downline', {
  downloadables: [],
  downloadLocation: '../',
  maxSimultaneous: 2,
});

new Vue({
  el: '#app',
  data: {
    newURL: '',
    isSettingsOpen: false,
    loadingItems: 0,
    downloadables: store.get('downloadables'),
    downloadLocation: store.get('downloadLocation'),
    maxSimultaneous: store.get('maxSimultaneous'),
    ongoingDownloads: 0,
    downloadQueue: [],
    appVersion: app.getVersion()
  },
  computed: {
    areChosenDownloading(){
      // True if chosen (or all items if none chosen) are downloading
      return this.downloadables
        .filter(x => x.isChosen || !this.anyChosen)
        .every(x => x.state === 'downloading');
    },
    anyChosen() {
      return this.downloadables.filter(x => x.isChosen).length !== 0;
    },
    existsItems() {
      return this.downloadables.length !== 0;
    },
    global() {
      // Selected items if any, else all items
      const selected = this.downloadables.filter(x => x.isChosen || !this.anyChosen);

      let global = {
        isGlobal: true,
        isSubsChosen: false,
        isAudioChosen: false,
        formats: {
          video: [], audio: [],
          videoIndex: 0, audioIndex: 0
        }
      }

      // Find largest video option among selected items
      global.formats.video = selected
        .map(x => x.formats.video)
        .reduce((max, curr) => curr.length > max.length ? curr : max, []);

      // Find largest audio option among selected items
      global.formats.audio = selected
        .map(x => x.formats.audio)
        .reduce((max, curr) => curr.length > max.length ? curr : max, []);
      
      return global;
    }
  },
  methods: {
    toggle(item) {
      item.isChosen = this.anyChosen ? !item.isChosen : false;
    },
    select(item) {
      item.isChosen = !item.isChosen;
    },
    chosenQuality(item) {
      if(item.isAudioChosen) {
        return item.formats.audio[item.formats.audioIndex];
      }
      return item.formats.video[item.formats.videoIndex];
    },
    increment(item) {
      if (item.isAudioChosen && item.formats.audioIndex < item.formats.audio.length - 1) {
        item.formats.audioIndex++;
        this.updateAudio(item);
      } else if (!item.isAudioChosen && item.formats.videoIndex < item.formats.video.length - 1) {
        item.formats.videoIndex++;
        this.updateVideo(item);
      }
    },
    decrement(item) {
      if (item.isAudioChosen && item.formats.audioIndex > 0) {
        item.formats.audioIndex--;
        this.updateAudio(item);
      } else if (!item.isAudioChosen && item.formats.videoIndex > 0) {
        item.formats.videoIndex--;
        this.updateVideo(item);
      }
    },
    updateAudio({ isGlobal }){
      // If global audio was modified, update audio of selected items
      if(isGlobal){
        const newValue = this.chosenQuality(this.global);

        this.downloadables.forEach(item => {
          if(item.isChosen || !this.anyChosen){
            const index = item.formats.audio.indexOf(newValue);
            if(index !== -1){
              item.formats.audioIndex = index;
            }
          }
        });
      }
    },
    updateVideo({ isGlobal }){
      // If global video was modified, update video of selected items
      if (isGlobal) {
        const newValue = this.chosenQuality(this.global);

        this.downloadables.forEach(item => {
          if (item.isChosen || !this.anyChosen) {
            const index = item.formats.video.indexOf(newValue);
            if (index !== -1) {
              item.formats.videoIndex = index;
            }
          }
        });
      }
    },
    updateChosenAudio(){
      this.global.isAudioChosen = !this.global.isAudioChosen;
      this.downloadables.forEach(item => {
        if(item.isChosen || !this.anyChosen){
          item.isAudioChosen = this.global.isAudioChosen;
        }
      });
    },
    updateChosenSubs(){
      this.global.isSubsChosen = !this.global.isSubsChosen;
      this.downloadables.forEach(item => {
        if(item.isSelected || !this.anyChosen){
          item.isSubsChosen = this.global.isSubsChosen;
        }
      });
    },
    fetchInfo() {
      if (this.newURL.trim().length !== 0) {
        // Load link if url field is not empty
        this.loadingItems++;

        const callbacks = {
          onSuccess: info => this.addItem(info),
          onError: err => console.log(err),
          onExit: () => this.loadingItems--
        };

        ytdl.fetchInfo([this.newURL], callbacks);

        this.newURL = '';
      } else {
        // Get link from clipboard
        this.newURL = clipboard.readText();
      }
    },
    addItem(info) {
      // Add downloadable to list if not already present
      if (this.downloadables.findIndex(x => x.url === info.url) === -1) {
        this.downloadables.push(info);
      }
    },
    download(url) {
      const index = this.downloadables.findIndex(x => x.url === url);
      const item = this.downloadables[index];

      if(this.ongoingDownloads < this.maxSimultaneous){
        this.downloadables[index].state = 'downloading';

        // Choose between audio and video
        const quality = item.isAudioChosen
          ? item.formats.audio[item.formats.audioIndex]
          : item.formats.video[item.formats.videoIndex]

        const options = {
          url: url,
          quality: quality,
          isAudioChosen: item.isAudioChosen,
          isSubsChosen: item.isSubsChosen,
          subtitles: item.subtitles,
          outputFormat: `${this.downloadLocation}/%(title)s.%(ext)s`
        }

        const callbacks = {
          onStart: () => console.log('Download Started'),
          onDownload: (url, progress) => {
            if (progress != null) {
              const index = this.downloadables.findIndex(x => x.url === url);
              this.downloadables[index].progress = progress;
            }
          },
          onComplete: (url) => {
            const index = this.downloadables.findIndex(x => x.url === url);

            // If process ends while downloading, download is complete
            // Prevents triggering of completion if process was stopped 
            // due to pausing the download
            if (this.downloadables[index].state === 'downloading') {
              this.downloadables[index].state = 'completed';
              this.ongoingDownloads--;

              this.downloadFromQueue();
            }
          }
        }

        this.ongoingDownloads++;
        ytdl.download(options, callbacks);
      } else {
        this.downloadables[index].state = 'queued';
        this.downloadQueue.push(url);
      }
    },
    progressValue(url) {
      const value = this.downloadables.find(x => x.url === url).progress.value;
      return { width: `${value}%` };
    },
    clear(url) {
      this.pause(url);
      const index = this.downloadables.findIndex(x => x.url === url);

      this.downloadables.splice(index, 1);
    },
    clearCompleted() {
      this.downloadables
        .filter(x => x.state === 'completed')
        .forEach(x => this.clear(x.url));
    },
    clearMany() {
      this.downloadables
        .filter(x => x.isChosen || !this.anyChosen)
        .forEach(x => this.clear(x.url));
    },
    pause(url) {
      const index = this.downloadables.findIndex(x => x.url === url);

      if(index !== -1){
        if (this.downloadables[index].state === 'downloading') {
          this.downloadables[index].state = 'stopped';
          this.ongoingDownloads--;

          ytdl.pause(url);

          this.downloadFromQueue();
        } else if (this.downloadables[index].state === 'queued') {
          this.downloadables[index].state = 'stopped';
          // Remove downloadable from queue
          this.downloadQueue.splice(this.downloadQueue.indexOf(url), 1);
        }
      }
    },
    downloadFromQueue(){
      // If download queue is not empty, request download
      if(this.downloadQueue.length !== 0){
        this.download(this.downloadQueue.shift());
      }
    },
    downloadOrPauseMany(){
      // Downloads or pauses multiple downloadables
      if(this.areChosenDownloading){
        // Pause
        this.downloadables.forEach(x => {
          if(x.isChosen || !this.anyChosen){
            this.pause(x.url);
          }
        });
      } else {
        // Download
        this.downloadables.forEach(x => {
          if( (x.isChosen || !this.anyChosen) && x.state === 'stopped' ){
            this.download(x.url);
          }
        });
      }
    },
    selectDirectory() {
      dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openDirectory']
      }, filePaths => {
        this.downloadLocation = filePaths[0];
      });
    },
    minimize() {
      remote.getCurrentWindow().minimize();
    },
    close() {
      // Store data
      store.set('downloadables', this.downloadables);
      store.set('downloadLocation', this.downloadLocation);
      store.set('maxSimultaneous', this.maxSimultaneous);

      // Close app
      remote.getCurrentWindow().close();
    }
  }
});
