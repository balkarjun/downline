/* NodeJS API for youtube-dl */

const { spawn } = require('child_process');

class YTDL{
  constructor(){
    this.ytdlPath = './resources/youtube-dl/youtube-dl';
    this.ffmpegPath = './resources/ffmpeg/ffmpeg';
    // Regex to extract download progress info from ytdl output
    this.progressRegex = /\[download\]\D+(\d+\.\d+)\D+(\d+\.\d+\w+)\D+(\d+\.\d+\w+\/s)\D+((?:\d+:?)+)/;
    // Stores data of ongoing downloads
    this.ongoing = [];
  }

  /* Fetches information for a list of URLs */
  fetchInfo(urls, callbacks){
    const args = ['--all-subs', '--dump-json', '--no-playlist', ...urls];
    const child = spawn(this.ytdlPath, args);

    child.stdout.on('data', data => callbacks.onSuccess(this._getMetadata(data.toString())));

    child.stderr.on('data', error => callbacks.onError(error.toString()));

    child.on('exit', callbacks.onExit);
  }

  /* Returns metadata for a url when given JSON dump */
  _getMetadata(data){
    let webpage_url, title, thumbnail, duration, formats, requested_subtitles;
    let video = [], audio = [];

    try{
      ({ webpage_url, title, thumbnail, duration, formats, requested_subtitles } = JSON.parse(data));

      formats.forEach(format => {
        if (format.vcodec !== 'none' && video.indexOf(format.height) === -1) {
          video.push(format.height);
        } else if (format.acodec !== 'none' && audio.indexOf(format.abr) === -1) {
          audio.push(format.abr);
        }
      });

      // Sort in descending order
      video.sort((a, b) => b - a);
      audio.sort((a, b) => b - a);
    } catch (err) {
      // If there was an error parsing JSON, use these as fallback

      webpage_url = /"webpage_url":\s?\"(.*?)\"/.exec(data)[1];
      title = /"title":\s?"(.*?)\"/.exec(data)[1];
      thumbnail = /"thumbnail":\s?"(.*?)\"/.exec(data)[1];
      duration = /"duration":\s?(\d*)/.exec(data)[1];

      video = ['1080', '720', '480', '360', '240', '144'];
      audio = ['160', '128', '50'];

      requested_subtitles = null;
    }

    // Get list of available subtitles
    const subtitles = requested_subtitles==null?[]:Object.keys(requested_subtitles);

    const metadata = {
      url: webpage_url,
      title: title,
      thumbnail: thumbnail,
      duration: this._formatDuration(duration),
      state: 'stopped',
      isChosen: false,
      isSubsChosen: false,
      isAudioChosen: false,
      formats: {
        video: video,
        audio: audio,
        videoIndex: 0,
        audioIndex: 0
      },
      subtitles: subtitles,
      progress: {
        value: 0,
        size: null,
        speed: null,
        eta: null
      }
    };
    return metadata;
  }

  /* Downloads a URL with given options */
  download(options, callbacks){
    const { url, quality, isAudioChosen, isSubsChosen, subtitles, outputFormat } = options;

    const format = isAudioChosen 
      ? `bestaudio[abr<=${quality}]` 
      : `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`;
    
    let args;
    if(isSubsChosen && subtitles.length !== 0){
      // Download and embed subtitles
      args = ['--ffmpeg-location', this.ffmpegPath, '--all-subs', '--embed-subs', '-f', format, '-o', outputFormat, url];
    } else {
      args = ['--ffmpeg-location', this.ffmpegPath, '-f', format, '-o', outputFormat, url];
    }

    const child = spawn(this.ytdlPath, args);
    callbacks.onStart();

    this.ongoing.push({
      url: url,
      pid: child.pid
    });

    // Send download progress info
    child.stdout.on('data', data => callbacks.onDownload(url, this._extractProgress(data.toString())));
    // Log errors
    child.stderr.on('data', data => console.error(data.toString()));
    
    child.on('close', () => {
      // Remove completed download from ongoing list
      const indexOfCompleted = this.ongoing.findIndex(x => x.url === url);
      this.ongoing.splice(indexOfCompleted, 1);

      callbacks.onComplete(url);
    });
  }

  /* Returns progress data when given console output */
  _extractProgress(data){
    const match = this.progressRegex.exec(data);

    return match
      ? { value: match[1], size: match[2], speed: match[3], eta: match[4] }
      : null;
  }

  /* Pauses download of given URL */
  pause(url){
    const index = this.ongoing.findIndex(x => x.url == url);
    
    if(index !== -1){
      // Kill child process
      process.kill(this.ongoing[index].pid);
    }
  }

  /* Converts seconds to hh:mm:ss format */
  _formatDuration(seconds){
    let duration = new Date(null);
    duration.setSeconds(seconds);
    // Extract string containing hh:mm:ss
    duration = duration.toISOString().substr(11, 8);

    // Remove unwanted zeros and return
    return duration.substr(duration.search(/[1-9]/));
  }
}

module.exports = YTDL;
