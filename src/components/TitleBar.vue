<template>
  <div id="titlebar">
    <div id="left">
      <img src="../assets/icons/settings.svg" />
      <img src="../assets/icons/info.svg" />
    </div>
    <div id="right">
      <span @click="minimize">
        <img id="minimize" src="../assets/icons/minimize.svg">
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
  height: 36px;
  display: flex;
  justify-content: space-between;
  -webkit-app-region: drag;
}

#titlebar img {
  width: 22px;
  height: 22px;
  align-self: center;
}

#left, #right {
  display: flex;
  -webkit-app-region: no-drag;
}

#left img {
  padding-left: 16px;
  cursor: pointer;
}

#minimize {
  position: relative;
  bottom: 8px;
}

#right span {
  padding: 0 12px;
  display: flex;
  cursor: pointer;
}
</style>
