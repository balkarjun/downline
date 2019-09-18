<template>
  <main>
    <section>
      <label>General</label>

      <div class="item download-location">
        <label>Download Location</label>
        <p class="light">{{ downloadLocation }}</p>
        <button @click="browse">Browse</button>
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
        <Checkbox v-model="ascii" />
      </div>

      <div class="item">
        <label>Autonumber playlist items</label>
        <Checkbox v-model="autonumber" />
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

import db from '../lib/db.js';

const { remote } = window.require('electron');

export default {
  name: 'settings',
  components: {
    Checkbox,
    CustomDialog
  },
  data() {
    return {
      downloadLocation: db.get('downloadLocation'),
      simultaneous: db.get('simultaneous'),
      filenameFormats: db.get('filenameFormats'),
      filenameIndex: db.get('filenameIndex'),
      audioFormats: db.get('audioFormats'),
      audioIndex: db.get('audioIndex'),
      videoFormats: db.get('videoFormats'),
      videoIndex: db.get('videoIndex'),
      ascii: db.get('ascii'),
      autonumber: db.get('autonumber')
    };
  },
  watch: {
    audioIndex: val => {
      db.set('audioIndex', val);
    },
    videoIndex: val => {
      db.set('videoIndex', val);
    },
    ascii: val => {
      db.set('ascii', val);
    },
    autonumber: val => {
      db.set('autonumber', val);
    }
  },
  methods: {
    browse() {
      remote.dialog.showOpenDialog(
        remote.getCurrentWindow(),
        {
          properties: ['openDirectory']
        },
        paths => {
          this.downloadLocation = paths[0];
          db.set('downloadLocation', this.downloadLocation);
        }
      );
    },
    setActiveFilenameFormat(index) {
      this.filenameIndex = index;

      db.set('filenameIndex', this.filenameIndex);
    },
    updateSimultaneous(count) {
      const newValue = this.simultaneous + count;
      if (newValue < 1 || newValue > 5) return;
      this.simultaneous = newValue;

      db.set('simultaneous', this.simultaneous);
    }
  }
};
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

.download-location p {
  width: calc(100% - 270px);
  overflow-x: scroll;
  white-space: nowrap;
}

.download-location button {
  margin-left: auto;
  height: 26px;
  border-radius: 4px;
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