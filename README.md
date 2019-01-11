# Downline
![GitHub All Releases](https://img.shields.io/github/downloads/jarbun/downline/total.svg)

**[Downline](https://jarbun.github.io/downline/) is a free and open source video and audio downloader** for YouTube, Vimeo, Dailymotion, SoundCloud and many other sites and works on Windows, MacOS and Linux.

Downline is built using [electron](https://electronjs.org/) and [vuejs](https://vuejs.org/), and uses [youtube-dl](https://github.com/rg3/youtube-dl/) and [ffmpeg](https://ffmpeg.org/).

**Download the latest version [here](https://github.com/jarbun/downline/releases/latest)**.

## Screenshots
<p align="center">
  <img src="https://user-images.githubusercontent.com/23068820/50515866-42650180-0acd-11e9-9e8f-02b0292929a5.png" alt="screenshot" width="540"/>
</p>

## Features
- Works for links from [several sites](https://rg3.github.io/youtube-dl/supportedsites.html)
- Choose audio and video quality (with support for 4K videos)
- Pause and resume downloads
- Download entire playlist and channel
- Download and embed subtitles
- Download multiple files simultaneously

### Coming Soon
- Choose video and audio format
- Choose format for filenames
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
Install dependencies (`electron` and `electron-builder`) and run the app (on port 5500):
```
npm install
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
More information about packaging and distribution can be found on the [electron-builder docs](https://www.electron.build/).

## Legal
This software is distributed under the [MIT license](https://github.com/jarbun/downline/blob/master/LICENSE).
