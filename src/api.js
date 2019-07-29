const { spawn } = require('child_process');
const { Transform } = require('stream');
const path = require('path');

const args = ['--all-subs', '--dump-json', '--no-playlist', '--ignore-errors'];
const ytdlPath = path.join(process.cwd(), '../resources', 'youtube-dl');

function fetchInfo(links) {
  const child = spawn(ytdlPath, [...args, ...links]);

  const tStream = new Transform({
    readableObjectMode: true,
    transform(chunk, encoding, callback) {
      this.push(createDownloadable(chunk));
      callback();
    }
  });

  return child.stdout.pipe(tStream);
}

function createDownloadable(data) {
  const metadata = JSON.parse(data.toString());
  const { webpage_url, title, thumbnail, duration, formats, requested_subtitles } = metadata;

  const downloadable = {
    url: webpage_url,
    title: title,
    thumbnail: thumbnail,
    duration: getDuration(duration),
    formats: getFormats(formats || metadata.format_id),
    subtitles: getSubtitles(requested_subtitles),
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
    const isAudioOnly = height === undefined && width === undefined;
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

module.exports = { fetchInfo };