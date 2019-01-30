/* NodeJS API for youtube-dl */
const { spawn } = require('child_process');
const path = require('path');

class YTDL {
  constructor() {
    // Path to youtube-dl binary
    this.ytdlPath = process.env.NODE_ENV === 'DEV'
      ? path.join(process.cwd(), 'resources', 'youtube-dl', 'youtube-dl')
      : path.join(__dirname, '../../', 'youtube-dl', 'youtube-dl');
    // Path to directory containing ffmpeg
    this.ffmpegPath = process.env.NODE_ENV === 'DEV'
      ? path.join(process.cwd(), 'resources', 'ffmpeg')
      : path.join(__dirname, '../../', 'ffmpeg');
    // Stores data of ongoing downloads
    this.ongoing = [];
    // Stores json output of youtube-dl
    this.jsonData = '';
  }

  /* Fetches information for a list of URLs */
  fetchInfo({ urls, onSuccess, onError, onExit }) {
    const args = ['--all-subs', '--dump-json', '--no-playlist', '--ignore-errors', ...urls];
    const child = spawn(this.ytdlPath, args);

    child.stdout.on('data', data => onSuccess(this._getMetadata(data.toString())));

    child.stderr.on('data', error => onError(error.toString()));

    child.on('exit', onExit);
  }

  /* Returns metadata for a url when given JSON dump */
  _getMetadata(data) {
    let metadata = null;

    this.jsonData += data;
    if (this._isValidJSON(this.jsonData)) {
      const { webpage_url, title, thumbnail, duration, formats, requested_subtitles, playlist_index, playlist_title, n_entries, playlist } = JSON.parse(this.jsonData);
      this.jsonData = '';

      let video = [], audio = [];
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

      // Get list of available subtitles
      const subtitles = requested_subtitles == null ? [] : Object.keys(requested_subtitles);

      metadata = {
        url: webpage_url,
        filepath: null,
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
        },
        playlist: {
          exists: !!playlist,
          entries: n_entries,
          title: playlist_title,
          index: playlist_index
        }
      };
    }

    return metadata;
  }

  _isValidJSON(string) {
    try {
      JSON.parse(string);
    } catch (err) {
      return false;
    }
    return true;
  }

  /* Downloads an item */
  download({ item, outputFormat, audioFormat, videoFormat, onStart, onDownload, onComplete }) {
    console.log(audioFormat, videoFormat);

    let format;
    if (item.isAudioChosen) {
      const quality = item.formats.audio[item.formats.audioIndex];
      format = `bestaudio[abr<=${quality}]`;
    } else {
      const quality = item.formats.video[item.formats.videoIndex];
      format = `bestvideo[height<=${quality}]+bestaudio/best[height<=${quality}]`;
    }

    let args;
    if (item.isSubsChosen && item.subtitles.length !== 0) {
      // Download and embed subtitles
      args = ['--ffmpeg-location', this.ffmpegPath, '--all-subs', '--embed-subs', '-f', format, '-o', outputFormat];
    } else {
      args = ['--ffmpeg-location', this.ffmpegPath, '-f', format, '-o', outputFormat];
    }

    if (item.isAudioChosen) {
      args.push(...['--extract-audio', '--audio-format', audioFormat]);
    } else if (videoFormat != 'best') {
      args.push(...['--recode-video', videoFormat]);
    }

    args.push(item.url);

    const child = spawn(this.ytdlPath, args);
    onStart();

    this.ongoing.push({ url: item.url, pid: child.pid });

    // Send download progress info
    child.stdout.on('data', data => {
      console.log(data.toString());
      onDownload(item.url, {
        progress: this._extractProgress(data.toString()),
        filepath: this._getFilepath(data.toString())
      });
    });
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
  _extractProgress(data) {
    const progressRegex = /\[download\]\D+(\d+\.\d+)\D+(\d+\.\d+\w+)\D+(\d+\.\d+\w+\/s)\D+((?:\d+:?)+)/;
    const match = progressRegex.exec(data);
    return match
      ? { value: match[1], size: match[2], speed: match[3], eta: match[4] }
      : null;
  }

  _getFilepath(data) {
    let match;
    // Encountered during merging of audio and video
    if ((match = /\[ffmpeg\].*?\"(.*)\"/.exec(data)) != null) {
      return match[1];
    }
    // Encountered during format conversion
    if ((match = /\[ffmpeg\].*?Destination:(.*)/.exec(data)) != null) {
      return match[1];
    }
    return null;
  }

  /* Pauses download of given URL by killing its child process */
  pause(url) {
    const index = this.ongoing.findIndex(x => x.url == url);

    if (index !== -1) {
      process.kill(this.ongoing[index].pid);
    }
  }

  /* Converts seconds to hh:mm:ss format */
  _formatDuration(seconds) {
    if (seconds) {
      let duration = new Date(null);
      duration.setSeconds(seconds);
      // Extract string containing hh:mm:ss
      duration = duration.toISOString().substr(11, 8);
      // Remove unwanted zeros and return
      if (duration[0] != '0') {
        return duration;
      } else if (duration[1] != '0') {
        return duration.substr(1);
      } else if (duration[3] != '0') {
        return duration.substr(3);
      } else {
        return duration.substr(4);
      }
    }
    return 'N/A';
  }

  /* Updates youtube-dl binary */
  update(setMessage) {
    const child = spawn(this.ytdlPath, ['--update']);

    child.stdout.on('data', data => {
      const message = data.toString();
      console.log(message);
      let match;
      if (/youtube-dl\sis\sup-to-date/.exec(message)) {
        setMessage('No updates available', 0);
      } else if ((match = /Updating\sto\sversion\s([\d.]+)/.exec(message)) != null) {
        setMessage(`Updating to version ${match[1]}`, 1);
      } else if (/Updated\syoutube-dl/.exec(message)) {
        setMessage('Updated successfully', 0);
      } else if (/ERROR:\sno\swrite\spermissions/) {
        setMessage('ERROR: Unable to update', 0);
      } else {
        setMessage(message);
      }
    });
  }
}

module.exports = YTDL;
