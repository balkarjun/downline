<template>
  <OnClickOutside :do="close">
    <div>
      <div ref="reference"></div>

      <button @click="open">
        <span class="flex" v-if="isObject">
          {{ active.quality }}
          <span class="light">{{ active.suffix }}</span>
        </span>
        <span v-else>{{ active }}</span>
      </button>

      <div ref="dialog" v-if="isOpen" class="dialog">
        <p
          v-for="(option, index) in options"
          :key="index"
          :class="{ active: index === value }"
          @click="select(index)"
        >
          <span class="flex" v-if="isObject">
            {{ option.quality }}
            <span v-if="index === value" class="light">{{
              option.suffix
            }}</span>
          </span>
          <span v-else>{{ option }}</span>
        </p>
      </div>
    </div>
  </OnClickOutside>
</template>

<script>
import OnClickOutside from './OnClickOutside.vue';
import Popper from 'popper.js';

export default {
  name: 'custom-dialog',
  props: {
    options: Array,
    value: Number,
    isObject: {
      type: Boolean,
      default: false
    }
  },
  components: {
    OnClickOutside
  },
  data() {
    return {
      isOpen: false
    };
  },
  computed: {
    active() {
      return this.options[this.value];
    }
  },
  methods: {
    open() {
      this.isOpen = true;
      this.$nextTick(() => {
        this.setupPopper();
        const activeElement = this.$refs.dialog.children[this.value];
        activeElement.scrollIntoView({ block: 'center' });
      });
    },
    close() {
      this.isOpen = false;
    },
    select(index) {
      this.$emit('input', index);
      this.close();
    },
    setupPopper() {
      new Popper(this.$refs.reference, this.$refs.dialog, {
        placement: 'bottom-start',
        modifiers: {
          flip: { enabled: false },
          computeStyle: { gpuAcceleration: false }
        }
      });
    }
  }
};
</script>

<style scoped>
button {
  display: flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border: 1px solid lightgray;
  background-color: white;
  border-radius: 4px;
  box-sizing: border-box;
}

.flex {
  display: flex;
}

.dialog {
  background-color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 0;
  width: 110px;
  max-height: 148px;
  overflow: scroll;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
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
</style>
