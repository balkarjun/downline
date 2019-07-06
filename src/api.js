const { spawn } = require('child_process');

const args = ['--all-subs', '--dump-json', '--no-playlist', '--ignore-errors'];
const ytdlPath = '../../resources/youtube-dl';

const MediaType = {
  VIDEO_ONLY: 'video-only',
  AUDIO: 'audio',
  VIDEO: 'video'
}

function fetchInfo(link) {
  const child = spawn(ytdlPath, [...args, link]);

  child.stdout.on('data', createDownloadable);
}

function createDownloadable(data) {
  const metadata = JSON.parse(data.toString())
  console.log(metadata);
}

function getMediaType(format) {
  const { vcodec, acodec, height, width } = format;

  if (height !== undefined || width !== undefined) {
    return (vcodec !== 'none' && acodec === 'none') ? MediaType.VIDEO_ONLY : MediaType.VIDEO;
  } else {
    return MediaType.AUDIO;
  }
}