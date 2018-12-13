const { clipboard, remote, shell } = require('electron');

let YTDL, Store;
if(process.env.NODE_ENV === 'DEV'){
  YTDL = require('/home/arjunb/Desktop/Downline/ytdl.js');
  Store = require('/home/arjunb/Desktop/Downline/store.js');
} else {
  YTDL = require('../ytdl.js');
  Store = require('../store.js');
}

const ytdl = new YTDL();
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
    isExtrasOpen: false,
    loadingItems: 0,
    downloadables: store.get('downloadables'),
    downloadLocation: store.get('downloadLocation'),
    maxSimultaneous: store.get('maxSimultaneous'),
    ongoingDownloads: 0,
    downloadQueue: [],
    appVersion: app.getVersion(),
    activeTab: 'settings'
  },
  computed: {
    anyToBeDownloaded(){
      // Returns true if any items chosen are to be downloaded
      return this.downloadables
        .filter(x => x.isChosen || !this.anyChosen)
        .some(x => x.state === 'stopped' && x.progress.value == 0);
    },
    anyCompleted(){
      // Returns true if any items chosen are completed
      return this.downloadables
        .filter(x => x.isChosen || !this.anyChosen)
        .some(x => x.state === 'completed');
    },
    anySubbed(){
      // Returns true if any selected item has subtitles
      return this.downloadables
        .filter(x => x.isChosen || !this.anyChosen)
        .some(x => x.subtitles.length !== 0);
    },
    areChosenDownloading(){
      // True if all chosen items are downloading
      return this.downloadables
        .filter(x => (x.isChosen || !this.anyChosen) && x.state !== 'completed')
        .every(x => x.state === 'downloading' || x.state === 'queued');
    },
    anyChosen() {
      // Returns true if any item is chosen
      return this.downloadables.some(x => x.isChosen);
    },
    existsItems() {
      return this.downloadables.length !== 0;
    },
    global() {
      // Selected items if any, else all items that are yet to be downloaded
      const selected = this.downloadables
        .filter(x => (x.isChosen || !this.anyChosen) && x.state === 'stopped' && x.progress.value == 0);

      let global = {
        isGlobal: true,
        isSubsChosen: false,
        isAudioChosen: false,
        formats: {
          video: [], audio: [],
          videoIndex: 0, audioIndex: 0
        }
      }

      // Set audio and video to union of all audio and video formats
      selected.map(x => x.formats)
      .forEach(x => {
        global.formats.video.push(...x.video);
        global.formats.audio.push(...x.audio);
      });

      global.formats.video = Array.from(new Set(global.formats.video));
      global.formats.audio = Array.from(new Set(global.formats.audio));

      // Sort in ascending order
      global.formats.video.sort((a, b) => a - b);
      global.formats.audio.sort((a, b) => a - b);
      
      global.formats.videoIndex = global.formats.video.length - 1;
      global.formats.audioIndex = global.formats.audio.length - 1;

      return global;
    }
  },
  methods: {
    isStarting(item) { return item.progress.value == 0 && item.state !== 'queued' },
    isQueued(item) { return item.state === 'queued' },
    isPaused(item) { return item.progress.value != 0 && item.state === 'stopped' },
    isDownloading(item) { return item.progress.value != 0 && item.state === 'downloading' },
    toggle(item) {
      item.isChosen = this.anyChosen ? !item.isChosen : false;
    },
    choose(item) {
      item.isChosen = !item.isChosen;
    },
    chosenQuality(item) {
      return item.isAudioChosen
        ? item.formats.audio[item.formats.audioIndex]
        : item.formats.video[item.formats.videoIndex]
    },
    increment(item) {
      if (item.isAudioChosen && item.formats.audioIndex < item.formats.audio.length - 1) {
        item.formats.audioIndex++;
      } else if (!item.isAudioChosen && item.formats.videoIndex < item.formats.video.length - 1) {
        item.formats.videoIndex++;
      }

      this.updateChosenQuality(item);
    },
    decrement(item) {
      if (item.isAudioChosen && item.formats.audioIndex > 0) {
        item.formats.audioIndex--;
      } else if (!item.isAudioChosen && item.formats.videoIndex > 0) {
        item.formats.videoIndex--;
      }

      this.updateChosenQuality(item);
    },
    updateChosenQuality(item){
      // If global audio/video were modified, update audio/video of selected items
      if(item.isGlobal){
        const newQuality = this.chosenQuality(this.global);

        this.downloadables.forEach(x => {
          if(x.isChosen || !this.anyChosen){
            const index = item.isAudioChosen
              ? x.formats.audio.indexOf(newQuality)
              : x.formats.video.indexOf(newQuality)
            
            if(index !== -1){
              if (item.isAudioChosen) x.formats.audioIndex = index;
              else x.formats.videoIndex = index;
            }
          }
        });
      }
      this.$forceUpdate();
    },
    updateChosenProp(prop){
      if (prop === 'audio') this.global.isAudioChosen = !this.global.isAudioChosen;
      else this.global.isSubsChosen = !this.global.isSubsChosen;

      this.downloadables.forEach(x => {
        if(x.isChosen || !this.anyChosen){
          if (prop === 'audio') x.isAudioChosen = this.global.isAudioChosen;
          else x.isSubsChosen = this.global.isSubsChosen;
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
      // Downloads or pauses mutliple items
      if(this.areChosenDownloading){
        // Pause all chosen
        this.downloadables.forEach(x => {
          if ((x.isChosen || !this.anyChosen) && x.state !== 'completed')
            this.pause(x.url)
        });
      } else {
        // Download all chosen
        this.downloadables.forEach(x => {
          if ((x.isChosen || !this.anyChosen) && x.state === 'stopped')
            this.download(x.url);
        });
      }
    },
    openLink(link){
      shell.openExternal(link);
    },
    selectDirectory() {
      dialog.showOpenDialog(remote.getCurrentWindow(), {
        properties: ['openDirectory']
      }, filePaths => this.downloadLocation = filePaths[0]);
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
