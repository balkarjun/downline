<template>
  <div>
    <button>Download All</button>
  </div>
</template>

<script>
export default {
  name: 'option-bar'
}
</script>

<style scoped>
div {
  height: 30px;
  width: calc(100% - 32px);
  margin: 0 16px;
  padding-top: 12px;
  padding-bottom: 6px;
}

button {
  height: 30px;
  padding: 0 16px;
  border-radius: 5px;
}
</style>
