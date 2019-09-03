<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'snackbar'
}
</script>

<style scoped>
div {
  position: absolute;
  bottom: 8px;
  height: 32px;
  width: 100%;
}

.slot {
  height: 32px;
  width: fit-content;
  line-height: 32px;
  padding: 0 16px;
  margin: 0 auto;
  color: white;
  border-radius: 4px;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.8);
  user-select: none;
}
</style>