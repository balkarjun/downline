<template>
  <div id="titlebar">
    <div id="left">
      <img src="../assets/icons/more_horizontal.svg">
    </div>
    <div id="right">
      <span @click="minimize">
        <img id="minimize" src="../assets/icons/minimize.svg">
      </span>
      <span @click="close">
        <img id="close" src="../assets/icons/close.svg">
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
  -webkit-app-region: drag;
}

#titlebar img {
  align-self: center;
}

#left, #right {
  display: flex;
  -webkit-app-region: no-drag;
}

#left img {
  width: 26px;
  height: 26px;
  padding-left: 16px;
  cursor: pointer;
}

#right span {
  padding: 0 12px;
  display: flex;
  cursor: pointer;
}

#minimize {
  width: 22px;
  height: 22px;
  position: relative;
  bottom: 7px;
}

#close {
  width: 20px;
  height: 20px;
}
</style>
