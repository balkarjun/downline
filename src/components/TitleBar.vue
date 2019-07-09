<template>
  <div id="titlebar">
    <div id="left">
      <img src="../assets/icons/settings.svg" />
      <img src="../assets/icons/info.svg" />
    </div>
    <div id="right">
      <span @click="minimize">&minus;</span>
      <span @click="close">&times;</span>
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

#left,
#right {
  display: flex;
  -webkit-app-region: no-drag;
}

#left img {
  width: 22px;
  height: 22px;
  padding-left: 16px;
  align-self: center;
  cursor: pointer;
}

#right span {
  font-size: 26px;
  padding: 0 12px;
  align-self: center;
  cursor: pointer;
}
</style>
