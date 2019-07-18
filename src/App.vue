<template>
  <div>
    <TitleBar />
    <InputBar />
    <Downloadable 
    title="Is Meat Bad for You? Is Meat Unhealthy?"
    thumbnail="https://i.ytimg.com/vi/ouAccsTzlGU/maxresdefault.jpg"
    duration="10:05" />
  </div>
</template>

<script>
import TitleBar from './components/TitleBar.vue';
import InputBar from './components/InputBar.vue';
import Downloadable from './components/Downloadable.vue';

export default {
  name: 'app',
  components: {
    TitleBar,
    InputBar,
    Downloadable
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
  font-size: 15px;
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
