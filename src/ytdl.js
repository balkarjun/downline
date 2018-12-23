/* NodeJS API for youtube-dl */
const { spawn } = require('child_process');
const path = require('path');

class YTDL{
  constructor(){
    // Path to youtube-dl binary
    this.ytdlPath = path.join(process.cwd(), 'resources', 'youtube-dl', 'youtube-dl');
    // Path to directory containing ffmpeg
    this.ffmpegPath = path.join(process.cwd(), 'resources', 'ffmpeg');
    // Regex to extract download progress info from ytdl output
    this.progressRegex = /\[download\]\D+(\d+\.\d+)\D+(\d+\.\d+\w+)\D+(\d+\.\d+\w+\/s)\D+((?:\d+:?)+)/;
    // Stores data of ongoing downloads
    this.ongoing = [];
  }

  /* Fetches information for a list of URLs */
  fetchInfo({ urls, onSuccess, onError, onExit }){
    const args = ['--all-subs', '--dump-json', '--no-playlist', ...urls];
    const child = spawn(this.ytdlPath, args);

    child.stdout.on('data', data => onSuccess(this._getMetadata(data.toString())));

    child.stderr.on('data', error => onError(error.toString()));

    child.on('exit', onExit);
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

      // Sort in ascending order
      video.sort((a, b) => a - b);
      audio.sort((a, b) => a - b);
    } catch (err) {
      // If there was an error parsing JSON, use these as fallback
      const urlRegex = /"webpage_url":\s?\"(.*?)\"/;
      const titleRegex = /"title":\s?\"(.*?)\"/;
      const thumbnailRegex = /"thumbnail":\s?\"(.*?)\"/;
      const durationRegex = /"duration":\s?(\d*)/;

      webpage_url = urlRegex.exec(data)[1];
      title = titleRegex.exec(data)[1];
      thumbnail = thumbnailRegex.exec(data)[1];
      duration = durationRegex.exec(data)[1];

      video = ['144', '240', '360', '480', '720', '1080'];
      audio = ['50', '128', '160'];

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
        videoIndex: video.length - 1,
        audioIndex: audio.length - 1
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

  /* Downloads an item */
  download({ item, outputFormat, onStart, onDownload, onComplete}){

    let format;
    if(item.isAudioChosen){
      const quality = item.formats.audio[item.formats.audioIndex];
      format = `bestaudio[abr<=${quality}]`;
    } else {
      const quality = item.formats.video[item.formats.videoIndex];
      format = `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`;
    }
    
    let args;
    if(item.isSubsChosen && item.subtitles.length !== 0){
      // Download and embed subtitles
      args = ['--ffmpeg-location', this.ffmpegPath, '--all-subs', '--embed-subs', '-f', format, '-o', outputFormat, item.url];
    } else {
      args = ['--ffmpeg-location', this.ffmpegPath, '-f', format, '-o', outputFormat, item.url];
    }

    const child = spawn(this.ytdlPath, args);
    onStart();

    this.ongoing.push({ url: item.url, pid: child.pid });

    // Send download progress info
    child.stdout.on('data', data => onDownload(item.url, this._extractProgress(data.toString())));
    // Log errors
    child.stderr.on('data', data => console.error(data.toString()));
    
    // Remove completed download from ongoing list
    child.on('close', () => {
      const indexOfCompleted = this.ongoing.findIndex(x => x.url === item.url);
      this.ongoing.splice(indexOfCompleted, 1);

      onComplete(item.url);
    });
  }

  /* Parses console output and returns progress info */
  _extractProgress(data){
    const match = this.progressRegex.exec(data);

    return match
      ? { value: match[1], size: match[2], speed: match[3], eta: match[4] }
      : null;
  }

  /* Pauses download of given URL by killing its child process */
  pause(url){
    const index = this.ongoing.findIndex(x => x.url == url);
    
    if(index !== -1){
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
