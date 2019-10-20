<template>
  <main>
    <TitleBar v-model="page" />

    <section class="page-home" v-show="page === 'home'">
      <div :class="{ shadow: scrolled }">
        <InputBar @output="add" />
        <OptionBar />
      </div>

      <div @scroll="handleScroll" id="downloadable-list">
        <Downloadable
          v-for="item in downloadables"
          :key="item.url"
          :data="item"
        />
      </div>
    </section>

    <Settings v-show="page === 'settings'" />

    <section class="page-about" v-show="page === 'about'">
      <p class="app-title">
        Downline 2.0.0
        <span class="branch-info">alpha.1</span>
      </p>
      <p>Free, open-source media downloader for youtube and many other sites</p>

      <button
        class="issues-button"
        @click="openLink('https://github.com/jarbun/downline/issues')"
      >
        Report bugs or suggest features
      </button>
    </section>

    <Snackbar v-show="isLoading">
      <p class="slot">Loading Links</p>
    </Snackbar>

    <div v-if="isConfirmOpen" class="confirm-dialog">
      <OnClickOutside :do="() => this.closeConfirm(false)">
        <div class="confirm-dialog-content">
          <label>{{ confirmMessage.title }}</label>
          <p>{{ confirmMessage.content }}</p>

          <div class="confirm-dialog-buttons">
            <button
              class="confirm-button"
              @click="() => this.closeConfirm(true)"
            >
              Yes
            </button>
            <button
              class="cancel-button"
              @click="() => this.closeConfirm(false)"
            >
              Cancel
            </button>
          </div>
        </div>
      </OnClickOutside>
    </div>
  </main>
</template>

<script>
import TitleBar from './components/TitleBar.vue';
import InputBar from './components/InputBar.vue';
import OptionBar from './components/OptionBar.vue';
import Downloadable from './components/Downloadable.vue';
import Snackbar from './components/Snackbar.vue';
import Settings from './views/Settings.vue';
import OnClickOutside from './components/OnClickOutside.vue';

const { shell } = window.require('electron');

import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'app',
  components: {
    TitleBar,
    InputBar,
    OptionBar,
    Downloadable,
    Snackbar,
    Settings,
    OnClickOutside
  },
  data() {
    return {
      scrolled: false,
      page: 'home'
    };
  },
  computed: mapGetters([
    'downloadables',
    'isLoading',
    'isConfirmOpen',
    'confirmMessage'
  ]),
  methods: {
    ...mapMutations(['closeConfirm']),
    ...mapActions(['add']),
    handleScroll(event) {
      this.scrolled = event.srcElement.scrollTop !== 0;
    },
    openLink(link) {
      shell.openExternal(link);
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

.page-home {
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

.confirm-dialog-content {
  width: 300px;
  height: 126px;
  position: absolute;
  top: calc(50% - 150px);
  left: calc(50% - 150px);
  background-color: #212121;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.confirm-dialog-content label {
  display: block;
  padding-top: 16px;
  padding-left: 22px;
  color: white;
}

.confirm-dialog-content p {
  padding-top: 4px;
  padding-left: 22px;
  color: #aaaaaa;
}

.confirm-dialog-buttons {
  margin-top: auto;
  height: 46px;
  background-color: #2a2a2a;
  display: flex;
  border-radius: 0 0 4px 4px;
  align-items: center;
}

.confirm-dialog-buttons .confirm-button {
  padding: 0 16px;
  height: 30px;
  color: white;
  background-color: transparent;
  margin-left: auto;
}

.confirm-dialog-buttons .cancel-button {
  background-color: #404040;
  padding: 0 16px;
  height: 30px;
  border-radius: 4px;
  color: white;
  margin-right: 8px;
}

.page-about {
  text-align: center;
}

.app-title {
  margin-top: 20px;
  margin-bottom: 8px;
}

.branch-info {
  background-color: lightgray;
  padding: 2px 8px;
  border-radius: 4px;
  margin-left: 4px;
}

.issues-button {
  margin-top: 20px;
  padding: 4px 12px;
  border-radius: 4px;
}
</style>
