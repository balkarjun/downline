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
          :class="{active: item.active}"
          @click="setActiveFilenameFormat(index)"
        >{{ item.name }}</button>
      </div>

      <div class="item">
        <label>Restrict filenames to ASCII</label>
        <Checkbox v-model="isAscii"/>
      </div>

      <div class="item">
        <label>Autonumber playlist items</label>
        <Checkbox v-model="isAutonumber"/>
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

export default {
  name: 'settings',
  components: {
   Checkbox,
   CustomDialog
  },
  data() {
    return {
      downloadLocation: 'C:\\Users\\Anon\\Downloads',
      simultaneous: 5,
      filenameFormats: [
        { key: '%(title)s.%(ext)s', name: 'Title', active: true },
        { key: '%(id)s.%(ext)s', name: 'ID', active: false },
        { key: '%(title)s-%(id)s.%(ext)s', name: 'Title + ID', active: false },
      ],
      audioFormats: ['mp3', 'wav', 'aac', 'flac', 'opus', 'vorbis'],
      audioIndex: 0,
      videoFormats: ['default', 'mp4', 'webm', 'mkv'],
      videoIndex: 0,
      isAscii: false,
      isAutonumber: false,
    }
  },
  methods: {
    setActiveFilenameFormat(index) {
      this.filenameFormats.forEach(x => x.active = false);
      this.filenameFormats[index].active = true;
    },
    updateSimultaneous(count) {
      const newValue = this.simultaneous + count;
      if (newValue < 1 || newValue > 5) return;
      this.simultaneous = newValue;
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