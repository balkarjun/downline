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

    <section v-show="page === 'about'">About Page</section>

    <Snackbar v-show="isLoading">
      <p class="slot">Loading Links</p>
    </Snackbar>

    <div v-if="isConfirmOpen" class="confirm-dialog">
      <OnClickOutside :do="() => this.closeConfirm(false)">
        <div class="confirm-dialog-content">
          <p>{{ confirmMessage }}</p>

          <button @click="() => this.closeConfirm(true)">Yes</button>
          <button @click="() => this.closeConfirm(false)">Cancel</button>
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
  width: 200px;
  height: 200px;
  position: absolute;
  top: 0;
  left: 0;
  background-color: teal;
}
</style>
