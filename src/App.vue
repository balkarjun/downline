<template>
  <main>
    <TitleBar v-model="page" />

    <section class="page-main" v-show="page === 'main'">
      <div :class="{ shadow: scrolled }">
        <InputBar @output="addDownloadables" />
        <OptionBar :count="downloadables.length" />
      </div>

      <div @scroll="handleScroll" id="downloadable-list">
        <Downloadable v-for="item in downloadables" :key="item.url" :data="item" @remove="remove" />
      </div>
    </section>

    <Settings v-show="page === 'settings'" />

    <section v-show="page === 'about'">About Page</section>

    <Snackbar v-show="nLoading > 0">
      <p class="slot">Loading Links</p>
    </Snackbar>
  </main>
</template>

<script>
import TitleBar from './components/TitleBar.vue';
import InputBar from './components/InputBar.vue';
import OptionBar from './components/OptionBar.vue';
import Downloadable from './components/Downloadable.vue';
import Snackbar from './components/Snackbar.vue';
import Settings from './views/Settings.vue';

import api from './lib/api.js';
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'app',
  components: {
    TitleBar,
    InputBar,
    OptionBar,
    Downloadable,
    Snackbar,
    Settings
  },
  data() {
    return {
      scrolled: false,
      page: 'main',
      nLoading: 0
    };
  },
  computed: mapGetters(['downloadables']),
  methods: {
    ...mapMutations(['addDownloadable']),
    addDownloadables(links) {
      this.nLoading++;

      const info = api.fetchInfo(links);
      info.on('data', this.addDownloadable);

      info.on('end', () => this.nLoading--);
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
