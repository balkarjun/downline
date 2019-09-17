<template>
  <div class="bar">
    <button v-if="count > 0" @click="handleClick">Download All</button>
    
    <div class="options" v-if="count > 0">
      <button @click="open">
        <img src="../assets/icons/options.svg">
      </button>

      <OnClickOutside :do="close">
        <div class="dialog" v-show="isOpen">
          Lorem ipsum
        </div>
      </OnClickOutside>
    </div>

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
import OnClickOutside from './OnClickOutside.vue';

export default {
  name: 'option-bar',
  props: ['count'],
  components: {
    OnClickOutside
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    },
    handleClick() {
      EventBus.$emit('downloadMany');
    }
  }
}
</script>

<style scoped>
.bar {
  height: 30px;
  display: flex;
  align-items: center;
  margin: 12px 32px 6px 16px;
}

button {
  height: 30px;
  width: 120px;
  border-radius: 4px;
}

.options {
  margin-left: 12px;
  margin-right: auto;
  position: relative;
}

.options button {
  width: 40px;
}

.options img {
  vertical-align: middle;
}

.dialog {
  width: 180px;
  height: 225px;
  position: absolute;
  top: 0;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
  box-sizing: border-box;
  border-radius: 4px;
}
</style>
