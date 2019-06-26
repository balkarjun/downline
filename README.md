# Downline
![GitHub All Releases](https://img.shields.io/github/downloads/jarbun/downline/total.svg)

[Downline](https://jarbun.github.io/downline/) is a free, cross-platform desktop application for downloading video and audio from YouTube and many other sites. Works on Windows, MacOS and Linux.

**Download the latest version [here](https://github.com/jarbun/downline/releases/latest)**.

## Screenshots
<p align="center">
  <img src="https://user-images.githubusercontent.com/23068820/52162513-f5db9a00-26fa-11e9-8cca-964d921f3bf3.png" alt="screenshots" width="460"/>
</p>

## Features
- Works for links from [several sites](https://rg3.github.io/youtube-dl/supportedsites.html)
- Choose audio and video quality (with support for 4K videos)
- Convert audio to multiple formats ```(mp3, aac, m4a and more)```
- Convert video to multiple formats ```(mp4, webm, mkv)```
- Pause and resume downloads
- Download entire playlist and channel
- Download and embed subtitles
- Download multiple files simultaneously

### Coming Soon
- More file naming options
- Notifications and system tray integration
- Load links from text file
- Display errors

## Developer Instructions
After downloading the source code, add the platform specific versions of youtube-dl and ffmpeg for the current platform as shown:
```
resources
├ ffmpeg
│ └ ffmpeg.exe
└ youtube-dl
  └ youtube-dl.exe
```
Install dependencies:
```
npm install
```
Running the app in development mode (so you can edit without having to restart the app everytime) requires `src/index.html` to be served from a local server on port 5500 (Ex:`http://127.0.0.1:5500/src/index.html`). You can use any program of your choice to serve the files or use the `vscode live server` extension if you're developing the app on VSCode. Once you've set up the server:
```
npm run dev
```

### Build Instructions
Before proceeding with the build steps, create a folder named `releases` in the root directory.
The build process performs the following steps:
- Clean output directories (removes `dist` and removes files from `releases`)
- Build distributable(s) for target platform(s)
- Compress portable distributions (requires `tar` and `7z`)
- Rename distributables in the format `downline-{version}-{type}-{platform}.{ext}`
- Move all distributables to `releases` folder

Place the dependencies for the target platform (e.g. for windows) in a folder as shown:
```
resources
│ ...
└ win
  ├ ffmpeg
  │ └ ffmpeg.exe
  └ youtube-dl
    └ youtube-dl.exe
```

Build for the target platform (`win`, `mac` or `linux`):
```
npm run build:platform
```
Build for all three platforms in parallel:
```
npm run build:all
```

If you would like to build for a platform without all the extra build steps (or `npm run build:platform` fails), run:
```
./node_modules/.bin/electron-builder build --platform
```

## Credits
- [youtube-dl](https://github.com/rg3/youtube-dl/)
- [ffmpeg](https://ffmpeg.org/)
- [electron](https://electronjs.org/)
- [electron-builder](https://www.electron.build/)
- [vuejs](https://vuejs.org/)

## Legal
This software is distributed under the [MIT license](https://github.com/jarbun/downline/blob/master/LICENSE).
