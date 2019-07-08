<template>
  <div id="titlebar">
    <div id="left">
      <img src="../assets/icons/settings.svg" />
      <img src="../assets/icons/info.svg" />
    </div>
    <div id="right">
      <span>&minus;</span>
      <span>&times;</span>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#titlebar {
  height: 36px;
  display: flex;
  justify-content: space-between;
}

#left {
  display: flex;
  padding-left: 16px;
}
#left img {
  align-self: center;
  width: 22px;
  height: 22px;
  padding-right: 16px;
  cursor: pointer;
}

#right {
  display: flex;
}

#right span {
  font-size: 26px;
  padding: 0 12px;
  align-self: center;
  cursor: pointer;
}
</style>
