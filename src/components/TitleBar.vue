<template>
  <div id="titlebar">
    <div class="left">
      <img src="../assets/icons/more_horiz.svg">
    </div>
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
const { remote } = window.require('electron');

export default {
  name: 'title-bar',
  methods: {
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
  -webkit-app-region: drag;
}

.left, .right {
  display: flex;
  -webkit-app-region: no-drag;
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
</style>
