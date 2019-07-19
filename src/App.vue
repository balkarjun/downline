<template>
  <div>
    <TitleBar />
    <InputBar @output="addDownloadables" />
    <OptionBar />
    <div id="downloadable-list">
      <Downloadable v-for="item in downloadables" :key="item.url"
      :title="item.title"
      :thumbnail="item.thumbnail"
      :duration="item.duration"
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
    }
  }
};
</script>

<style>
@font-face {
  font-family: Rubik;
  src: url(./assets/fonts/rubik_regular.ttf);
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
</style>
