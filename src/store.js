import Vue from 'vue';
import Vuex from 'vuex';

import api from './lib/api.js';

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
        formatIndex: 2,
        subtitles: ['pl', 'zh-TW', 'fr', 'ar']
      }
    ],
    nLoading: 0
  },
  getters: {
    downloadables: state => state.downloadables,
    isLoading: state => state.nLoading > 0,
    count: state => state.downloadables.length
  },
  mutations: {
    addDownloadable(state, data) {
      const index = state.downloadables.findIndex(x => x.url === data.url);

      if (index === -1) {
        state.downloadables.push(data);
      }
    },
    removeDownloadable(state, url) {
      const index = state.downloadables.findIndex(x => x.url === url);

      if (index !== -1) {
        state.downloadables.splice(index, 1);
      }
    },
    updateLoading(state, newValue) {
      state.nLoading += newValue;
    },
    updateFormatIndex(state, { url, value }) {
      const index = state.downloadables.findIndex(x => x.url === url);

      if (index !== -1) {
        state.downloadables[index].formatIndex = value;
      }
    }
  },
  actions: {
    addDownloadables({ commit }, links) {
      commit('updateLoading', 1);

      const info = api.fetchInfo(links);
      info.on('data', data => commit('addDownloadable', data));

      info.on('end', () => commit('updateLoading', -1));
    }
  }
});
