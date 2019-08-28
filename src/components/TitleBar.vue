<template>
  <div id="titlebar">
    <OnClickOutside :do="closeDialog">
      <div class="left">
        <img @click="openDialog" src="../assets/icons/more_horiz.svg">
        <div class="dialog" v-if="isOpen">
          <p>Settings</p>
          <p>About</p>
        </div>
      </div>
    </OnClickOutside>
    <span class="spacer" :class="{draggable: !isOpen}"></span>
    <div class="right">
      <span @click="minimize">
        <img src="../assets/icons/minimize.svg">
      </span>
      <span @click="close">
        <img src="../assets/icons/close.svg">
      </span>
    </div>
  </div>
</template>

<script>
import OnClickOutside from './OnClickOutside.vue';

const { remote } = window.require('electron');

export default {
  name: 'title-bar',
  components: {
    OnClickOutside,
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spacer {
  height: 100%;
  width: 100%;
}

.draggable {
  -webkit-app-region: drag;
}

.left, .right {
  display: flex;
}

.left img {
  padding-left: 16px;
  cursor: pointer;
}

.right span {
  padding: 0 12px;
  display: flex;
  cursor: pointer;
}

.dialog {
  width: 120px;
  position: absolute;
  left: 16px;
  top: 12px;
  z-index: 1;
  border-radius: 5px;
  background-color: white;
  padding: 4px 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
}

.dialog p {
  padding: 6px 0 6px 16px;
  cursor: pointer;
}

.dialog p:hover {
  background-color: whitesmoke;
}
</style>
