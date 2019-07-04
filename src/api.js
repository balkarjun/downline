const { spawn } = require('child_process');

const args = ['--all-subs', '--dump-json', '--no-playlist', '--ignore-errors'];
const ytdlPath = '../../resources/youtube-dl';

function fetchInfo(link) {
  const child = spawn(ytdlPath, [...args, link]);

  child.stdout.on('data', createDownloadable);
}

function createDownloadable(data) {
  const metadata = JSON.parse(data.toString())
  console.log(metadata);
}
