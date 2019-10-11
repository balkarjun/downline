import Vue from 'vue';
import Vuex from 'vuex';

import api from './lib/api.js';
import State from './lib/state.js';

Vue.use(Vuex);

const store = new Vuex.Store({
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
        state: State.STOPPED,
        progress: null,
        subtitles: ['pl', 'zh-TW', 'fr', 'ar'],
        playlist: {
          exists: !false,
          title: null,
          index: null,
          count: null
        }
      }
    ],
    nLoading: 0
  },
  getters: {
    downloadables: state => state.downloadables,
    isLoading: state => state.nLoading > 0,
    count: state => state.downloadables.length,
    canDownloadMany: state => {
      return state.downloadables.some(
        x => State.isStopped(x.state) || State.isPaused(x.state)
      );
    },
    isAllAudioChosen: state => {
      return !state.downloadables
        .map(item => item.formats[item.formatIndex].isAudioOnly)
        .some(item => item === false);
    }
  },
  mutations: {
    add(state, data) {
      state.downloadables.push(data);
    },
    remove(state, index) {
      state.downloadables.splice(index, 1);
    },
    updateState(state, { index, value }) {
      state.downloadables[index].state = value;
    },
    updateProgress(state, { index, value }) {
      state.downloadables[index].progress = value;
    },
    updateFormatIndex(state, { index, value }) {
      state.downloadables[index].formatIndex = value;
    },
    updateLoading(state, newValue) {
      state.nLoading += newValue;
    }
  },
  actions: {
    add({ commit }, links) {
      commit('updateLoading', 1);

      const info = api.fetchInfo(links);
      info.on('data', data => {
        if (getIndex(data.url) === -1) {
          commit('add', data);
        }
      });

      info.on('end', () => commit('updateLoading', -1));
    },
    remove({ state, dispatch, commit }, url) {
      const index = getIndex(url);

      if (index !== -1) {
        const itemState = state.downloadables[index].state;
        if (
          State.isStarting(itemState) ||
          State.isDownloading(itemState) ||
          State.isProcessing(itemState) ||
          State.isQueued(itemState)
        ) {
          dispatch('pause', url);
        }
        commit('remove', index);
      }
    },
    download({ state, commit }, url) {
      let index = getIndex(url);

      const { formats, formatIndex, playlist } = state.downloadables[index];
      const args = { url, playlist, format: formats[formatIndex] };

      const process = api.download(args);

      if (process === null) {
        commit('updateState', { index, value: State.QUEUED });
        return;
      }

      commit('updateState', { index, value: State.STARTING });

      process.on('data', data => {
        const index = getIndex(url);
        if (data === 'processing') {
          commit('updateState', { index, value: State.PROCESSING });
        } else if (data !== '') {
          commit('updateState', { index, value: State.DOWNLOADING });
          commit('updateProgress', { index, value: data });
        }
      });

      process.on('end', () => {
        index = getIndex(url);
        if (!State.isPaused(state.downloadables[index].state)) {
          commit('updateState', { index, value: State.COMPLETED });
        }
      });
    },
    pause({ commit }, url) {
      const index = getIndex(url);
      commit('updateState', { index, value: State.PAUSED });
      api.pause(url);
    },
    reload({ commit }, url) {
      const index = getIndex(url);
      commit('updateState', { index, value: State.STOPPED });
      commit('updateProgress', { index, value: null });
    },
    downloadMany({ state, dispatch }) {
      state.downloadables.forEach(item => {
        if (State.isStopped(item.state) || State.isPaused(item.state)) {
          dispatch('download', item.url);
        }
      });
    },
    pauseMany({ state, dispatch }) {
      state.downloadables.forEach(item => {
        if (
          !State.isStopped(item.state) &&
          !State.isPaused(item.state) &&
          !State.isCompleted(item.state)
        ) {
          dispatch('pause', item.url);
        }
      });
    },
    clearMany({ state, dispatch }, shouldClearAll) {
      let urls = state.downloadables;
      if (!shouldClearAll) {
        urls = urls.filter(x => State.isCompleted(x.state));
      }

      urls = urls.map(x => x.url);
      urls.forEach(url => dispatch('remove', url));
    },
    updateFormat({ state, commit }, payload) {
      const index = getIndex(payload.url);
      const value = state.downloadables[index].formats.findIndex(
        x => x.code === payload.code
      );
      commit('updateFormatIndex', { index, value });
    },
    toggleAudioChosen({ state, commit }, payload) {
      const index = getIndex(payload.url);
      const value = state.downloadables[index].formats.findIndex(
        x => x.isAudioOnly === payload.newValue
      );
      commit('updateFormatIndex', { index, value });
    },
    toggleAllAudioChosen({ state, commit }, newValue) {
      for (let index = 0; index < state.downloadables.length; index++) {
        const { formats, formatIndex } = state.downloadables[index];

        if (formats[formatIndex].isAudioOnly === newValue) continue;

        const value = formats.findIndex(x => x.isAudioOnly === newValue);
        commit('updateFormatIndex', { index, value });
      }
    }
  }
});

function getIndex(url) {
  return store.state.downloadables.findIndex(x => x.url === url);
}

api.queueEvent.on('dequeue', url => {
  if (url) {
    store.dispatch('download', url);
  }
});

export default store;
