const { spawn } = require('child_process');
const { Transform } = require('stream');
const path = require('path');

const EventEmitter = require('events');
const queueEvent = new EventEmitter();

const store = require('./lib/store');

const ytdlPath = path.join(process.cwd(), '../resources', 'youtube-dl');
const ffmpegPath = path.join(process.cwd(), '../resources', 'ffmpeg');

const active = new Map();
let queue = [];

function fetchInfo(links) {
  const args = ['--all-subs', '--dump-json', '--no-playlist', '--ignore-errors'];
  const child = spawn(ytdlPath, [...args, ...links]);

  const tStream = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      this.push(createDownloadable(chunk.toString()));
      callback();
    }
  });

  return child.stdout.pipe(tStream);
}

function createDownloadable(data) {
  const metadata = JSON.parse(data);
  const { webpage_url, title, thumbnail, duration, formats, requested_subtitles, playlist, playlist_title, playlist_index, n_entries } = metadata;

  const downloadable = {
    url: webpage_url,
    title: title,
    thumbnail: thumbnail,
    duration: getDuration(duration),
    formats: getFormats(formats || metadata.format_id),
    subtitles: getSubtitles(requested_subtitles),
    playlist: {
      exists: !!playlist,
      title: playlist_title,
      index: playlist_index,
      count: n_entries
    }
  };
  return downloadable;
}

function getFormats(data) {
  if (!Array.isArray(data)) {
    return [{
      isAudioOnly: false,
      quality: data,
      suffix: '',
      code: data
    }];
  }

  let formats = [];
  let seen = new Set();

  data.forEach(format => {
    const { acodec, vcodec, abr, width, height, format_id } = format;
    const isAudioOnly = height == undefined && width == undefined;
    const isVideoOnly = vcodec !== 'none' && acodec === 'none';

    const quality = isAudioOnly ? abr : (height || format_id);
    const suffix = isAudioOnly ? 'kbps' : (isVideoOnly
      ? 'p'
      : (Number.isInteger(quality) ? 'p' : '')
    );
    const code = isAudioOnly ? `bestaudio[abr<=${abr}]` : (isVideoOnly
      ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`
      : format_id
    );

    const key = (isAudioOnly ? 'a' : 'v') + quality;
    if (quality && !seen.has(key)) {
      formats.push({ isAudioOnly, quality, suffix, code });
      seen.add(key);
    }
  });
  formats.reverse();
  return formats;
}

function getSubtitles(subtitles) {
  return subtitles === null ? [] : Object.keys(subtitles);
}

function getDuration(duration) {
  const total = Math.floor(duration || 0);
  if (total === 0) return '-';

  const pad = num => String(num).padStart(2, '0');

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = (total % 3600) % 60;

  if (hours !== 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  else if (minutes !== 0) return `${pad(minutes)}:${pad(seconds)}`;
  else return `0:${pad(seconds)}`;
}

function download({ url, formatCode, isAudio, playlist }) {
  if (active.size >= store.get('simultaneous')) {
    queue.push(url);
    return null;
  }
  
  const child = spawn(ytdlPath, generateArgs({ url, formatCode, isAudio, playlist }));

  active.set(url, child.pid);

  const tStream = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      this.push(getProgress(chunk.toString()));
      callback();
    }
  });

  child.stdout.on('end', () => {
    active.delete(url);
    queueEvent.emit('dequeue', queue.shift());
  });

  return child.stdout.pipe(tStream);
}

function generateArgs({ url, formatCode, isAudio, playlist }) {
  let args = ['--ffmpeg-location', ffmpegPath, '-f', formatCode, '-o', getOutputFormat(playlist)];
  args.push(...getAVOptions(isAudio));
  args.push(url);

  return args;
}

function getAVOptions(isAudio) {
  const index = store.get(isAudio ? 'audioIndex' : 'videoIndex');
  const format = store.get(isAudio ? 'audioFormats' : 'videoFormats')[index];
  
  const options = isAudio
    ? ['--extract-audio', '--audio-format', format]
    : ['--recode-video', format];
  
  return format === 'default' ? [] : options;
}

function getOutputFormat(playlist) {
  const index = store.get('filenameIndex');
  let format = store.get('filenameFormats')[index].key;
  
  if (playlist.exists) {
    format = path.join(playlist.title, format);
  }

  return path.join(store.get('downloadLocation'), format);
}

function getProgress(data) {
  const regex = /(?<percent>\d+\.\d+)\D+(?<size>\d+\.\d+)(?<unit>\w+)\D+(?<speed>\d+\.\d+\w+\/s)\D+(?<eta>[\d:]+)/;
  const match = regex.exec(data);

  if (match) {
    const { percent, size, unit, speed, eta } = match.groups;
    const progress = {
      percent: percent,
      downloaded: ((percent / 100) * size).toFixed(2),
      size: size + unit,
      speed: speed,
      remaining: getETA(eta)
    };
    return progress;
  } else if (data.includes('[ffmpeg]')) {
    return 'processing';
  }
  return '';
}

function getETA(eta) {
  const hRegex = /(?<hr>\d+):(?<min>\d+):(?<sec>\d+)/;
  const mRegex = /(?<min>\d+):(?<sec>\d+)/;
  let { hr, min, sec } = (hRegex.exec(eta) || mRegex.exec(eta)).groups;

  hr = hr ? Number(hr) : 0;
  min = Number(min);
  sec = Number(sec);

  return (hr !== 0) ? `${min >= 30 ? hr + 1 : hr}h left`
    : (min !== 0) ? `${sec >= 30 ? min + 1 : min}min left`
      : `${sec + 1}s left`;
}

function pause(url) {
  // If queued, remove from queue
  const index = queue.indexOf(url);
  if (index) queue.splice(index, 1);
  // If active, kill process
  const pid = active.get(url);
  if (pid) process.kill(pid);
}

module.exports = { fetchInfo, download, pause, queueEvent };