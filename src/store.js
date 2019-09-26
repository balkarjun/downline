import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    downloadables: [
      {
        url: 'https://www.youtube.com/watch?v=ouAccsTzlGU',
        title: 'Is Meat Bad for You? Is Meat Unhealthy?',
        thumbnail: 'https://i.ytimg.com/vi/ouAccsTzlGU/maxresdefault.jpg',
        duration: '10:05',
        formats: [
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
            quality: 480,
            suffix: 'p',
            code: 'bestvideo[height<=480]+bestaudio/best[height<=480]'
          },
          {
            isAudioOnly: false,
            quality: 720,
            suffix: 'p',
            code: 'bestvideo[height<=720]+bestaudio/best[height<=720]'
          }
        ],
        subtitles: ['pl', 'zh-TW', 'fr', 'ar']
      }
    ]
  },
  getters: {
    downloadables: state => state.downloadables
  },
  mutations: {
    addDownloadable: (state, data) => {
      const index = state.downloadables.findIndex(x => x.url === data.url);

      if (index === -1) {
        state.downloadables.push(data);
      }
    },
    removeDownloadable: (state, url) => {
      const index = state.downloadables.findIndex(x => x.url === url);

      if (index !== -1) {
        state.downloadables.splice(index, 1);
      }
    }
  },
  actions: {}
});
