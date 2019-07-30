<template>
  <OnClickOutside :do="close">
    <div class="container">
      <div ref="reference"></div>
      <div @click="open" class="active-quality">
        <p>{{ activeQuality }}<span class="light">{{ activeSuffix }}</span></p>
      </div>
      <div ref="dialog" v-if="isOpen" class="dialog">
        <p 
          v-for="(format, index) in formats" 
          :key="index" 
          :class="{active: index === activeIndex}"
          @click="select(index)"
        >{{ format.quality }}<span v-if="index === activeIndex" class="light">{{ format.suffix }}</span></p>
      </div>
    </div>
  </OnClickOutside>
</template>

<script>
import OnClickOutside from './OnClickOutside.vue';
import Popper from 'popper.js';

export default {
  name: 'quality-select',
  components: {
    OnClickOutside
  },
  props: ['formats'],
  data() {
    return {
      isOpen: false,
      activeIndex: 0
    }
  },
  watch: {
    formats() {
      this.activeIndex = 0;
    }
  },
  computed: {
    activeQuality() {
      return this.formats[this.activeIndex].quality;
    },
    activeSuffix() {
      return this.formats[this.activeIndex].suffix;
    }
  },
  methods: {
    select(index) {
      this.activeIndex = index;
      this.close();
    },
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
      this.$nextTick(() => {
        this.setupPopper();
        const activeElement = this.$refs.dialog.children[this.activeIndex];
        activeElement.scrollIntoView({ block: 'center' });
      });
    },
    setupPopper() {
      new Popper(this.$refs.reference, this.$refs.dialog, {
        placement: 'bottom-start',
        modifiers: {
          flip: {
            enabled: false
          },
          computeStyle: {
            gpuAcceleration: false
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.active-quality {
  display: flex;
  line-height: 28px;
  height: 28px;
  padding: 0 12px;
  border: 1px solid lightgray;
  background-color: white;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;
}

.active-quality p {
  display: inline;
  align-self: center;
}

.dialog {
  background-color: white;
  border: none;
  border-radius: 5px;
  padding: 4px 0;
  width: 110px;
  max-height: 148px;
  overflow: scroll;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
  box-sizing: border-box;
}

.dialog::-webkit-scrollbar {
  width: 2px;
}

.dialog p {
  padding-left: 16px;
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
