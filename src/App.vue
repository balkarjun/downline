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
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>
