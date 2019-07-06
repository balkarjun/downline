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

function getFormats(rawFormats) {
  let formats = { video: [], audio: [] };
  let audioSeen = new Set();
  let videoSeen = new Set();

  rawFormats.forEach(format => {
    const type = getMediaType(format);
    const { abr, height, format_id } = format;

    if (type === MediaType.AUDIO && abr && !audioSeen.has(abr)) {
      formats.audio.push({
        quality: abr,
        code: `bestaudio[abr<=${abr}]`
      })
      audioSeen.add(abr);
    } else if (type === MediaType.VIDEO_ONLY && height && !videoSeen.has(height)) {
      formats.video.push({
        quality: height,
        code: `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`
      })
      videoSeen.add(height);
    } else if (type === MediaType.VIDEO && !videoSeen.has(height || format_id)) {
      formats.video.push({
        quality: height || format_id,
        code: format_id
      })
      videoSeen.add(height || format_id);
    }
  });
  return formats;
}

function getMediaType(format) {
  const { vcodec, acodec, height, width } = format;

  if (height !== undefined || width !== undefined) {
    return (vcodec !== 'none' && acodec === 'none') ? MediaType.VIDEO_ONLY : MediaType.VIDEO;
  } else {
    return MediaType.AUDIO;
  }
}