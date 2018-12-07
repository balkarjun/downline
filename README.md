# Downline
**Downline is a free and open source video and audio downloader for Windows and Linux**, supporting many sites including YouTube, Vimeo, Dailymotion and SoundCloud.
It is a GUI for the popular [youtube-dl](https://rg3.github.io/youtube-dl/) command-line application and is built using ElectronJS and VueJS.

_This application is currently under development._

**Download the beta version [here](https://github.com/jarbun/downline/releases)**

## Features
* _Choose audio and video quality (with support for 4K videos)_
* _Pause and resume downloads_
* _Playlist download_
* _Download and embed subtitles_
* _Download multiple files simultaneously_

## Coming Soon
* _Support for MacOS_
* _Choose output format for video and audio_
* _Display error messages for faulty URLs_
* _Choose output name format_
* _Minimize app to system tray_
* _Load URLs from file_

## Developer Instructions
After downloading the source code, create a folder called _resources_ in the app's root directory, and add the platform specific versions of [youtube-dl]( https://rg3.github.io/youtube-dl/download.html) and [ffmpeg](http://ffmpeg.org/download.html) in folders named _youtube-dl_ and _ffmpeg_ respectively. With node installed, run the following instructions to install the dependencies and run the app
```
npm install
npm start
```
To build for linux and windows, run the following commands
```
npm run build:linux
npm run build:win
```

## Legal
This software is distributed under the [MIT license](https://github.com/jarbun/downline/blob/master/LICENSE)
