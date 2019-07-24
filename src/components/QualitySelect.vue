<template>
  <OnClickOutside :do="close">
    <div class="container">
      <div v-if="isOpen" class="dialog">
        <p 
          v-for="format in formats" 
          :key="format" 
          :class="{active: format === value}"
          @click="select(format)"
        >{{ format }}<span v-if="format === value" class="light">p</span></p>
      </div>
      <div @click="open" class="active-quality">
        {{ value }}<span class="light">p</span>
      </div>
    </div>
  </OnClickOutside>
</template>

<script>
import OnClickOutside from './OnClickOutside.vue';

export default {
  name: 'quality-select',
  components: {
    OnClickOutside
  },
  data() {
    return {
      isOpen: false,
      value: 1080,
      formats: [
        1440, 1080, 720, 480, 360, 240, 144
      ]
    }
  },
  methods: {
    select(format) {
      this.value = format;
      this.close();
    },
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    }
  }
}
</script>

<style scoped>

.active-quality {
  line-height: 28px;
  height: 28px;
  padding: 0 12px;
  border: 1px solid lightgray;
  border-radius: 5px;
  cursor: pointer;
}

.dialog {
  background-color: white;
  position: absolute;
  border: none;
  border-radius: 5px;
  padding: 8px 0;
  width: 110px;
  max-height: 140px;
  overflow: scroll;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
}

.dialog::-webkit-scrollbar {
  width: 2px;
}

.dialog p {
  padding: 0;
  padding-left: 16px;
  margin: 0;
  line-height: 28px;
  cursor: pointer;
}

.dialog p:hover {
  background-color: whitesmoke;
}

.dialog p.active {
  background-color: lightgray;
}

.light {
  color: gray;
}
</style>
