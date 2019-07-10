<template>
  <div @click="$emit('next')">
    <img src="../assets/icons/swap_horiz.svg">
  </div>
</template>

<style scoped>
div {
  background-color: lightgray;
  display: flex;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  align-self: center;
}

img {
  width: 18px;
  height: 18px;
  align-self: center;
  margin: 0 auto;
}
</style>
