<template>
  <div>
    <button v-if="count > 0" @click="handleClick">Download All</button>
    
    <p v-show="count > 0">
      {{ count }}
      <span class="light">
        Item{{ count > 1 ? 's' : '' }}
      </span>
    </p>
  </div>
</template>

<script>
import EventBus from '../lib/bus.js';

export default {
  name: 'option-bar',
  props: ['count'],
  methods: {
    handleClick() {
      EventBus.$emit('downloadMany');
    }
  }
}
</script>

<style scoped>
div {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 32px 6px 16px;
}

button {
  height: 30px;
  width: 120px;
  border-radius: 4px;
}
</style>
