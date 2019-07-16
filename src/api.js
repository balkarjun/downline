const { spawn } = require('child_process');

const args = ['--all-subs', '--dump-json', '--no-playlist', '--ignore-errors'];
const ytdlPath = '../../resources/youtube-dl';

function fetchInfo(link) {
  const child = spawn(ytdlPath, [...args, link]);

  child.stdout.on('data', createDownloadable);
}

function createDownloadable(data) {
  const metadata = JSON.parse(data.toString());
  const { webpage_url, title, thumbnail, duration, formats, requested_subtitles} = metadata;
  
  const downloadable = {
    url: webpage_url,
    title: title,
    thumbnail: thumbnail,
    duration: duration,
    formats: getFormats(formats),
    subtitles: getSubtitles(requested_subtitles),
  };
  console.log(downloadable, downloadable.formats);
}

function getFormats(rawFormats) {
  let formats = { video: [], audio: [] };
  let audioSeen = new Set();
  let videoSeen = new Set();

  rawFormats.forEach(format => {
    const { acodec, vcodec, abr, width, height, format_id } = format;
    let quality = null, code = null;

    if (height === undefined && width === undefined) {
      // Format has audio only
      quality = abr;
      code = `bestaudio[abr<=${abr}]`;
      if (quality && !audioSeen.has(quality)) {
        formats.audio.push({ quality, code });
        audioSeen.add(quality);
      }
    } else {
      if (vcodec !== 'none' && acodec === 'none') {
        // Format has video only
        quality = height;
        code = `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`;
      } else {
        // Format has both audio and video
        quality = height || format_id;
        code = format_id;
      }
      if (quality && !videoSeen.has(quality)) {
        formats.video.push({ quality, code });
        videoSeen.add(quality);
      }
    }
  });
  return formats;
}

function getSubtitles(subtitles) {
  return subtitles === null ? [] : Object.keys(subtitles);
}