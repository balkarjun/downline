<template>
  <main>
    <TitleBar v-model="page" />
    <section class="page-main" v-show="page === 'main'">
      <div :class="{ shadow: scrolled }">
        <InputBar @output="addDownloadables" />
        <OptionBar :count="downloadables.length" />
      </div>
      <div @scroll="handleScroll" id="downloadable-list">
        <Downloadable 
          v-for="item in downloadables" :key="item.url"
          :data="item"
          @remove="remove"
        />
      </div>
    </section>
    <section v-show="page === 'settings'">
      Settings Page
    </section>
    <section v-show="page === 'about'">
      About Page
    </section>
  </main>
</template>

<script>
import TitleBar from './components/TitleBar.vue';
import InputBar from './components/InputBar.vue';
import OptionBar from './components/OptionBar.vue';
import Downloadable from './components/Downloadable.vue';

const { remote } = window.require('electron');
const api = remote.require('./api');

export default {
  name: 'app',
  components: {
    TitleBar,
    InputBar,
    OptionBar,
    Downloadable
  },
  data() {
    return {
      scrolled: false,
      page: 'main',
      downloadables: [
        {
          url: 'https://www.youtube.com/watch?v=ouAccsTzlGU',
          title: 'Is Meat Bad for You? Is Meat Unhealthy?',
          thumbnail: 'https://i.ytimg.com/vi/ouAccsTzlGU/maxresdefault.jpg',
          duration: '10:05',
          formats: [
            {
              isAudioOnly: true,
              quality: 50,
              suffix: 'kbps',
              code: 'bestaudio[abr<=50]'
            },
            {
              isAudioOnly: true,
              quality: 70,
              suffix: 'kbps',
              code: 'bestaudio[abr<=70]'
            },
            {
              isAudioOnly: true,
              quality: 128,
              suffix: 'kbps',
              code: 'bestaudio[abr<=128]'
            },
            {
              isAudioOnly: true,
              quality: 160,
              suffix: 'kbps',
              code: 'bestaudio[abr<=160]'
            },
            {
              isAudioOnly: false,
              quality: 144,
              suffix: 'p',
              code: 'bestvideo[height<=144]+bestaudio/best[height<=144]'
            },
            {
              isAudioOnly: false,
              quality: 240,
              suffix: 'p',
              code: 'bestvideo[height<=240]+bestaudio/best[height<=240]'
            },
            {
              isAudioOnly: false,
              quality: 360,
              suffix: 'p',
              code: 'bestvideo[height<=360]+bestaudio/best[height<=360]'
            },
            {
              isAudioOnly: false,
              quality: 480,
              suffix: 'p',
              code: 'bestvideo[height<=480]+bestaudio/best[height<=480]'
            },
            {
              isAudioOnly: false,
              quality: 720,
              suffix: 'p',
              code: 'bestvideo[height<=720]+bestaudio/best[height<=720]'
            },
            {
              isAudioOnly: false,
              quality: 1080,
              suffix: 'p',
              code: 'bestvideo[height<=1080]+bestaudio/best[height<=1080]'
            }
          ],
          subtitles: [
            'pl', 'zh-TW', 'fr',     'ar',
            'ja', 'az',    'mn',     'hy',
            'ru', 'ta',    'es-419', 'ko',
            'no', 'hu',    'de',     'en',
            'pt', 'hi',    'ro',     'tr',
            'nl', 'id',    'it',     'ka',
            'vi'
          ]
        }
      ]
    }
  },
  methods: {
    addDownloadables(links) {
      api.fetchInfo(links)
      .on('data', data => {
        if (this.downloadables.findIndex(x => x.url === data.url) === -1) {
          this.downloadables.push(data);
        } else {
          console.log('Already exists');
        }
      });
    },
    handleScroll(event) {
      this.scrolled = event.srcElement.scrollTop !== 0;
    },
    remove(url) {
      const index = this.downloadables.findIndex(x => x.url === url);
      if (index !== -1) {
        this.downloadables.splice(index, 1);
      }
    }
  }
};
</script>

<style>
@font-face {
  font-family: Rubik;
  src: url(./assets/fonts/rubik_regular.ttf);
}

::-webkit-scrollbar {
  width: 4px;
  height: 0;
}

::-webkit-scrollbar-thumb {
  background: lightgray;
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Rubik;
  font-size: 15px;
}

p {
  margin: 0;
  padding: 0;
}

button {
  border: 0;
  background: lightgray;
  outline: none;
  font-size: 15px;
  cursor: pointer;
  font-family: Rubik;
}

main {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.page-main {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#downloadable-list {
  overflow: scroll;
  overflow-x: hidden;
  height: 100%;
}

#downloadable-list:last-child {
  margin-bottom: 4px;
}

.shadow {
  box-shadow: 0 3px 4px -2px rgba(0, 0, 0, 0.1);
}

.light {
  color: gray;
}
</style>
