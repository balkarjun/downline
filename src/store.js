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
    addDownloadable(state, data) {
      const index = getIndex(data.url);

      if (index === -1) {
        state.downloadables.push(data);
      }
    },
    updateLoading(state, newValue) {
      state.nLoading += newValue;
    },
    updateFormatIndex(state, { url, value }) {
      const index = getIndex(url);

      if (index !== -1) {
        state.downloadables[index].formatIndex = value;
      }
    },
    updateState(state, { url, value }) {
      const index = getIndex(url);

      if (index !== -1) {
        state.downloadables[index].state = value;
      }
    },
    updateProgress(state, { url, value }) {
      const index = getIndex(url);

      if (index !== -1) {
        state.downloadables[index].progress = value;
      }
    }
  },
  actions: {
    remove({ state, dispatch }, url) {
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
        state.downloadables.splice(index, 1);
      }
    },
    addDownloadables({ commit }, links) {
      commit('updateLoading', 1);

      const info = api.fetchInfo(links);
      info.on('data', data => commit('addDownloadable', data));

      info.on('end', () => commit('updateLoading', -1));
    },
    download({ state, commit }, url) {
      const index = getIndex(url);

      const args = {
        url,
        format:
          state.downloadables[index].formats[
            state.downloadables[index].formatIndex
          ],
        playlist: state.downloadables[index].playlist
      };

      const process = api.download(args);

      if (process === null) {
        commit('updateState', { url, value: State.QUEUED });
        return;
      }

      commit('updateState', { url, value: State.STARTING });

      process.on('data', data => {
        if (data === 'processing') {
          commit('updateState', { url, value: State.PROCESSING });
        } else if (data !== '') {
          commit('updateProgress', { url, value: data });
          commit('updateState', { url, value: State.DOWNLOADING });
        }
      });

      process.on('end', () => {
        if (!State.isPaused(state.downloadables[index].state)) {
          commit('updateState', { url, value: State.COMPLETED });
        }
      });
    },
    pause({ commit }, url) {
      commit('updateState', { url, value: State.PAUSED });
      api.pause(url);
    },
    reload({ commit }, url) {
      commit('updateState', { url, value: State.STOPPED });
      commit('updateProgress', { url, value: null });
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
    clearAll({ state, dispatch }) {
      const answer = confirm(
        `Do you want to delete all ${state.downloadables.length} item(s)?`
      );

      if (answer) {
        const urls = state.downloadables.map(x => x.url);
        urls.forEach(url => dispatch('remove', url));
      }
    },
    clearCompleted({ state, dispatch }) {
      const answer = confirm(`Do you want to delete all completed item(s)?`);

      if (answer) {
        const urls = state.downloadables
          .filter(x => State.isCompleted(x.state))
          .map(x => x.url);
        urls.forEach(url => dispatch('remove', url));
      }
    },
    toggleAllAudioChosen({ state, commit }, newValue) {
      let updates = [];
      state.downloadables.forEach(item => {
        if (item.formats[item.formatIndex].isAudioOnly === newValue) {
          return;
        }

        const newFormatIndex = item.formats.findIndex(
          x => x.isAudioOnly === newValue
        );
        updates.push({ url: item.url, value: newFormatIndex });
      });

      updates.forEach(update => {
        commit('updateFormatIndex', update);
      });
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
