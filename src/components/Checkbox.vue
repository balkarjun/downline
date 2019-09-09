<template>
  <button @click="toggle" :class="{checked: value}">
    <img v-if="value" src="../assets/icons/check.svg">
  </button>
</template>

<script>
export default {
  name: 'checkbox',
  props: ['value'],
  methods: {
    toggle() {
      this.$emit('input', !this.value);
    }
  }
}
</script>

<style scoped>
button {
  width: 20px;
  height: 20px;
  padding: 0;
  border-radius: 4px;
  border: 1px solid lightgray;
  display: flex;
  justify-content: center;
  background-color: white;
}

.checked {
  background-color: gray;
}
</style>
