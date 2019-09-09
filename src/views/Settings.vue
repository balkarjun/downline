<template>
  <div id="settings-page">
    <section>
      <label>General</label>
      <div class="item download-location">
        <p class="title">Download Location</p>
        <p class="value">C:\Users\Anon\Downloads</p>
        <button>Browse</button>
      </div>
      <div class="item simultaneous-downloads">
        <p class="title">Simultaneous Downloads</p>
        <div class="value">
          <button @click="updateSimultaneous(-1)">
            <img src="../assets/icons/decrement.svg">
          </button>
          <p>{{ simultaneous }}</p>
          <button @click="updateSimultaneous(1)">
            <img src="../assets/icons/increment.svg">
          </button>
        </div>
      </div>
    </section>
    <section class="filename">
      <label>Filename</label>
      <div class="item filename-format">
        <p class="title">Format</p>
        <div class="value">
          <button 
            v-for="(item, index) in filenameFormats" 
            :key="index" 
            :class="{active: item.active}"
            @click="setActiveFilenameFormat(index)"
          >{{ item.name }}</button>
        </div>
      </div>
      <div class="item ascii">
        <p class="title">Restrict filenames to ASCII</p>
        <Checkbox v-model="isAscii"/>
      </div>
      <div class="item autonumber">
        <p class="title">Autonumber playlist items</p>
        <Checkbox v-model="isAutonumber"/>
      </div>
    </section>
    <section class="format">
      <label>Format</label>
      <div class="item audio-format">
        <p class="title">Audio Format</p>
        <OnClickOutside :do="closeAudioDialog">
          <div class="value">
            <div ref="audioRef"></div>
            <div @click="openAudioDialog" class="active-audio">
              <p>{{ audioFormat }}</p>
            </div>
            <div ref="audioDialog" v-if="isAudioOpen" class="dialog">
              <p
                v-for="(format, index) in audioFormats"
                :key="index"
                :class="{active: index === audioIndex}"
                @click="selectAudio(index)"
              >{{ format }}</p>
            </div>
          </div>
        </OnClickOutside>
      </div>
    </section>
  </div>
</template>

<script>
import Checkbox from '../components/Checkbox.vue';
import OnClickOutside from '../components/OnClickOutside.vue';
import Popper from 'popper.js';

export default {
  name: 'settings',
  components: {
   Checkbox,
   OnClickOutside
  },
  data() {
    return {
      simultaneous: 5,
      filenameFormats: [
        { key: '%(title)s.%(ext)s', name: 'Title', active: true },
        { key: '%(id)s.%(ext)s', name: 'ID', active: false },
        { key: '%(title)s-%(id)s.%(ext)s', name: 'Title + ID', active: false },
      ],
      audioFormats: ['mp3', 'wav', 'aac', 'flac', 'opus', 'vorbis'],
      audioIndex: 0,
      isAudioOpen: false,
      isAscii: false,
      isAutonumber: false,
    }
  },
  computed: {
    audioFormat() {
      return this.audioFormats[this.audioIndex];
    }
  },
  methods: {
    openAudioDialog() {
      this.isAudioOpen = true;
      this.$nextTick(() => {
        this.setupPopper();
        const activeElement = this.$refs.audioDialog.children[this.audioIndex];
        activeElement.scrollIntoView({ block: 'center' });
      });
    },
    setupPopper() {
      new Popper(this.$refs.audioRef, this.$refs.audioDialog, {
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
    },
    closeAudioDialog() {
      this.isAudioOpen = false;
    },
    selectAudio(index) {
      this.audioIndex = index;
      this.closeAudioDialog();
    },
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
#settings-page {
  padding-top: 16px;
  padding-left: 24px;
  height: 100vh;
  overflow: scroll;
}

label {
  color: gray;
}

.item {
  height: 36px;
  display: flex;
  align-items: center;
}

.title {
  padding-right: 16px;
}

.download-location .value {
  color: gray;
}

.download-location button {
  margin-left: auto;
  height: 26px;
  border-radius: 4px;
  padding: 0 16px;
  margin-right: 40px;
}

.simultaneous-downloads .value {
  display: flex;
  align-items: center;
}

.simultaneous-downloads .value button {
  height: 25px;
  width: 25px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
}

.simultaneous-downloads .value p {
  width: 25px;
  text-align: center;
}

.filename {
  margin-top: 24px;
}

.filename-format .value button {
  background-color: white;
  height: 26px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin-right: 8px;
}

.filename-format .value button.active {
  background-color: lightgray;
  border-color: transparent;
}

.format {
  margin-top: 24px;
}

.active-audio {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 12px;
  border: 1px solid lightgray;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  box-sizing: border-box;
}

.dialog {
  background-color: white;
  border: none;
  border-radius: 4px;
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
</style>