<template>
  <div>
    <TitleBar />
    <InputBar />
  </div>
</template>

<script>
import TitleBar from './components/TitleBar.vue';
import InputBar from './components/InputBar.vue';

export default {
  name: 'app',
  components: {
    TitleBar,
    InputBar
  }
};
</script>

<style>
@font-face {
  font-family: Rubik;
  src: url(./assets/fonts/rubik_regular.ttf);
}

body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Rubik;
}

button {
  border: 0;
  background: lightgray;
  outline: none;
  font-size: 15px;
  cursor: pointer;
  font-family: Rubik;
}
</style>
