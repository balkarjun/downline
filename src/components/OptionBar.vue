<template>
  <div class="bar">
    <button v-if="count > 0" @click="handleClick">Download All</button>
    
    <div class="options" v-if="count > 0">
      <button @click="open">
        <img src="../assets/icons/options.svg">
      </button>

      <OnClickOutside :do="close">
        <div class="dialog" v-show="isOpen">
          <div class="option">
            Quality
            <CustomDialog :options="quality" :isObject="true" v-model="qualityIndex" />
          </div>
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
import CustomDialog from './CustomDialog.vue';

export default {
  name: 'option-bar',
  props: ['count'],
  components: {
    OnClickOutside,
    CustomDialog
  },
  data() {
    return {
      isOpen: false,
      quality: [
        { quality: 50, suffix: 'kbps' },
        { quality: 70, suffix: 'kbps' }
      ],
      qualityIndex: 0
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
  width: 170px;
  height: 190px;
  position: absolute;
  top: 0;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px 0;
}

.option {
  height: 36px;
  padding-left: 12px;
  padding-right: 6px;
  line-height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
