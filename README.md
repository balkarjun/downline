# Downline
**Downline is a free and open source video and audio downloader** for YouTube, Vimeo, Dailymotion, SoundCloud and many other sites and works on Windows and Linux.

It is a GUI for the awesome [youtube-dl](https://rg3.github.io/youtube-dl/) command-line media downloader and is built using ElectronJS and VueJS.

**Download the latest version [here](https://github.com/jarbun/downline/releases/latest)**

## Screenshots
<p align="center">
  <img src="https://user-images.githubusercontent.com/23068820/50515866-42650180-0acd-11e9-9e8f-02b0292929a5.png" alt="screenshot" width="540"/>
</p>

## Features
* Works for links from [several sites](https://rg3.github.io/youtube-dl/supportedsites.html)
* Choose audio and video quality (with support for 4K videos)
* Pause and resume downloads
* Download entire playlist and channel
* Download and embed subtitles
* Download multiple files simultaneously

### Coming Soon
* Support for MacOS
* Change video and audio format
* Choose format for filenames
* Minimize app to system tray
* Load URLs from text file

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
