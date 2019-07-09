<template>
  <TitleBar />
</template>

<script>
import TitleBar from './components/TitleBar.vue';

export default {
  name: 'app',
  components: {
    TitleBar
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
