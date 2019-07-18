const { spawn } = require('child_process');
const { Transform } = require('stream');
const path = require('path');

const args = ['--all-subs', '--dump-json', '--no-playlist', '--ignore-errors'];
const ytdlPath = path.join(process.cwd(), '../resources', 'youtube-dl');

function fetchInfo(link) {
  const child = spawn(ytdlPath, [...args, link]);

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
  const { webpage_url, title, thumbnail, duration, formats, requested_subtitles} = metadata;
  
  const downloadable = {
    url: webpage_url,
    title: title,
    thumbnail: thumbnail,
    duration: getDuration(duration),
    formats: getFormats(formats),
    subtitles: getSubtitles(requested_subtitles),
  };
  return downloadable;
}

function getFormats(rawFormats) {
  let formats = { video: [], audio: [] };
  let audioSeen = new Set();
  let videoSeen = new Set();

  rawFormats.forEach(format => {
    const { acodec, vcodec, abr, width, height, format_id } = format;
    const isAudioOnly = height === undefined && width === undefined;
    const isVideoOnly = vcodec !== 'none' && acodec === 'none';

    const quality = isAudioOnly ? abr : (height || format_id);
    const code = isAudioOnly ? `bestaudio[abr<=${abr}]` : isVideoOnly
      ? `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`
      : format_id;

    if (isAudioOnly && quality && !audioSeen.has(quality)) {
      formats.audio.push({ quality, code });
      audioSeen.add(quality);
    }
    else if (!isAudioOnly && quality && !videoSeen.has(quality)) {
      formats.video.push({ quality, code });
      videoSeen.add(quality);
    }
  });
  return formats;
}

function getSubtitles(subtitles) {
  return subtitles === null ? [] : Object.keys(subtitles);
}

function getDuration(duration) {
  const total = Math.floor(duration || 0);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = (total % 3600) % 60;

  const pad = (num, char) => num !== 0 ? String(num).padStart(2, '0') + char : '';
  return pad(hours, ':') + pad(minutes, ':') + pad(seconds, '');
}

module.exports = { fetchInfo };