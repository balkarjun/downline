<template>
  <main>
    <section>
      <label>General</label>

      <div class="item download-location">
        <label>Download Location</label>
        <input type="text" v-model="downloadLocation">
        <button>Browse</button>
      </div>

      <div class="item simultaneous-downloads">
        <label>Simultaneous Downloads</label>
        <button @click="updateSimultaneous(-1)">&minus;</button>
        <p class="value">{{ simultaneous }}</p>
        <button @click="updateSimultaneous(1)">&plus;</button>
      </div>
    </section>

    <section>
      <label>Filename</label>

      <div class="item filename-format">
        <label>Format</label>
        <button 
          v-for="(item, index) in filenameFormats" 
          :key="index" 
          :class="{active: index === filenameIndex}"
          @click="setActiveFilenameFormat(index)"
        >{{ item.name }}</button>
      </div>

      <div class="item">
        <label>Restrict filenames to ASCII</label>
        <Checkbox v-model="ascii"/>
      </div>

      <div class="item">
        <label>Autonumber playlist items</label>
        <Checkbox v-model="autonumber"/>
      </div>
    </section>

    <section>
      <label>Format</label>

      <div class="item">
        <label>Audio Format</label>
        <CustomDialog :options="audioFormats" v-model="audioIndex" />
      </div>
      
      <div class="item">
        <label>Video Format</label>
        <CustomDialog :options="videoFormats" v-model="videoIndex" />
      </div>
    </section>
  </main>
</template>

<script>
import Checkbox from '../components/Checkbox.vue';
import CustomDialog from '../components/CustomDialog.vue';

const { remote } = window.require('electron');
const store = remote.require('./lib/store');

export default {
  name: 'settings',
  components: {
   Checkbox,
   CustomDialog
  },
  data() {
    return {
      downloadLocation: store.get('downloadLocation'),
      simultaneous: store.get('simultaneous'),
      filenameFormats: store.get('filenameFormats'),
      filenameIndex: store.get('filenameIndex'),
      audioFormats: store.get('audioFormats'),
      audioIndex: store.get('audioIndex'),
      videoFormats: store.get('videoFormats'),
      videoIndex: store.get('videoIndex'),
      ascii: store.get('ascii'),
      autonumber: store.get('autonumber'),
    }
  },
  watch: {
    audioIndex: val => {
      store.set('audioIndex', val);
    },
    videoIndex: val => {
      store.set('videoIndex', val);
    },
    ascii: val => {
      store.set('ascii', val);
    },
    autonumber: val => {
      store.set('autonumber', val);
    }
  },
  methods: {
    setActiveFilenameFormat(index) {
      this.filenameIndex = index;

      store.set('filenameIndex', this.filenameIndex);
    },
    updateSimultaneous(count) {
      const newValue = this.simultaneous + count;
      if (newValue < 1 || newValue > 5) return;
      this.simultaneous = newValue;

      store.set('simultaneous', this.simultaneous);
    }
  }
}
</script>

<style scoped>
main {
  padding-top: 16px;
  padding-left: 24px;
  height: 100vh;
  overflow: scroll;
}

section:not(:last-child) {
  margin-bottom: 24px;
}

label {
  color: gray;
}

.item {
  height: 36px;
  display: flex;
  align-items: center;
}

.item label {
  padding-right: 16px;
  color: black;
}

.title {
  padding-right: 16px;
}

.download-location input {
  flex-grow: 1;
  font: inherit;
  height: 26px;
  box-sizing: border-box;
  border: 1px solid lightgray;
  border-right: none;
  border-radius: 4px 0 0 4px;
  padding-left: 12px;
  padding-right: 8px;
  outline: none;
}

.download-location button {
  margin-left: auto;
  height: 26px;
  border-radius: 0 4px 4px 0;
  padding: 0 16px;
  margin-right: 30px;
}

.simultaneous-downloads button {
  height: 25px;
  width: 25px;
  border-radius: 4px;
  font-size: 20px;
  color: #666;
}

.simultaneous-downloads .value {
  width: 25px;
  text-align: center;
}

.filename-format button {
  background-color: white;
  height: 26px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin-right: 8px;
}

.filename-format button.active {
  background-color: lightgray;
  border-color: transparent;
}
</style>