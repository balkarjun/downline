<template>
  <div id="app-content">
    <div id="app-top" :class="{ shadow: scrolled }">
      <TitleBar />
      <InputBar @output="addDownloadables" />
      <OptionBar />
    </div>
    <div @scroll="handleScroll" id="downloadable-list">
      <Downloadable v-for="item in downloadables" 
        :key="item.url"
        :data="item"
      />
    </div>
  </div>
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
      downloadables: [
        {
          url: 'https://www.youtube.com/watch?v=ouAccsTzlGU',
          title: 'Is Meat Bad for You? Is Meat Unhealthy?',
          thumbnail: 'https://i.ytimg.com/vi/ouAccsTzlGU/maxresdefault.jpg',
          duration: '10:05',
          formats: {
            video: [],
            audio: []
          },
          subtitles: []
        }
      ]
    }
  },
  methods: {
    addDownloadables(links) {
      api.fetchInfo(links)
      .on('data', data => this.downloadables.push(data));
    },
    handleScroll(event) {
      this.scrolled = event.srcElement.scrollTop !== 0;
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

button {
  border: 0;
  background: lightgray;
  outline: none;
  font-size: 15px;
  cursor: pointer;
  font-family: Rubik;
}

#app-content {
  display: flex;
  flex-direction: column;
  height: 550px;
}

#downloadable-list {
  overflow: scroll;
  overflow-x: hidden;
  height: 100%;
}

.shadow {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}
</style>
