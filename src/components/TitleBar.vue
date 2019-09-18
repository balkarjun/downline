<template>
  <div id="titlebar" :class="{ highlight: value !== 'main' }">
    <OnClickOutside v-if="value === 'main'" :do="closeDialog">
      <div class="left">
        <img @click="openDialog" src="../assets/icons/more_horiz.svg" />

        <div class="dialog" v-if="isOpen">
          <p @click="setPage('settings')">Settings</p>
          <p @click="setPage('about')">About</p>
        </div>
      </div>
    </OnClickOutside>

    <div class="left" v-else>
      <img @click="setPage('main')" src="../assets/icons/back.svg" />
      <p>{{ value === 'settings' ? 'Settings' : 'About' }}</p>
    </div>

    <span class="spacer" :class="{ draggable: !isOpen }"></span>

    <div class="right">
      <img @click="minimize" src="../assets/icons/minimize.svg" />
      <img @click="close" src="../assets/icons/close.svg" />
    </div>
  </div>
</template>

<script>
import OnClickOutside from './OnClickOutside.vue';

const { remote } = window.require('electron');

export default {
  name: 'title-bar',
  components: {
    OnClickOutside
  },
  props: ['value'],
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    setPage(newPage) {
      this.closeDialog();
      this.$emit('input', newPage);
    },
    openDialog() {
      this.isOpen = true;
    },
    closeDialog() {
      this.isOpen = false;
    },
    close() {
      remote.getCurrentWindow().close();
    },
    minimize() {
      remote.getCurrentWindow().minimize();
    }
  }
};
</script>

<style scoped>
#titlebar {
  height: 32px;
  min-height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.highlight {
  background-color: whitesmoke;
}

.spacer {
  height: 100%;
  width: 100%;
}

.draggable {
  -webkit-app-region: drag;
}

.left,
.right {
  display: flex;
}

.left img {
  padding-left: 16px;
  cursor: pointer;
}

.left p {
  padding-left: 8px;
  align-self: center;
}

.right img {
  padding: 0 12px;
  cursor: pointer;
}

.dialog {
  width: 120px;
  position: absolute;
  left: 16px;
  top: 12px;
  z-index: 1;
  border-radius: 4px;
  background-color: white;
  padding: 4px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.dialog p {
  padding: 6px 0 6px 16px;
  cursor: pointer;
}

.dialog p:hover {
  background-color: whitesmoke;
}
</style>
