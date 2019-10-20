<template>
  <div v-show="count > 0" class="bar">
    <button v-if="canDownloadMany" @click="downloadMany">Download All</button>
    <button v-else @click="pauseMany">Pause All</button>

    <div class="options">
      <button @click="open">
        <img src="../assets/icons/options.svg" />
      </button>

      <OnClickOutside v-if="isOpen" :do="close">
        <div class="dialog">
          <div class="option">
            Quality
            <CustomDialog
              :options="globalQuality"
              :isObject="true"
              :value="globalQuality[globalQualityIndex].code"
              @input="handleDialog"
            />
          </div>

          <div class="option">
            Audio Only
            <button
              @click="toggleAllAudioChosen(!isAllAudioChosen)"
              :class="{ active: isAllAudioChosen }"
            >
              <img src="../assets/icons/music_note.svg" />
            </button>
          </div>

          <!-- <div class="option">
            Subtitles
            <button @click="toggleSubsChosen" :class="{ active: isSubsChosen }">
              <img src="../assets/icons/subtitles.svg" />
            </button>
          </div> -->

          <hr />

          <div class="buttons">
            <button @click="clearAll">Clear All</button>
            <button @click="clearCompleted">Clear Completed</button>
          </div>
        </div>
      </OnClickOutside>
    </div>

    <p>
      {{ count }}
      <span class="light">Item{{ count > 1 ? 's' : '' }}</span>
    </p>
  </div>
</template>

<script>
import OnClickOutside from './OnClickOutside.vue';
import CustomDialog from './CustomDialog.vue';

import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'option-bar',
  components: {
    OnClickOutside,
    CustomDialog
  },
  data() {
    return {
      isOpen: false,
      isAudioChosen: false,
      isSubsChosen: false,
      quality: [
        {
          isAudioOnly: true,
          quality: 50,
          suffix: 'kbps',
          code: 'bestaudio[abr<=50]'
        },
        {
          isAudioOnly: false,
          quality: 480,
          suffix: 'kbps',
          code: 'bestvideo[height<=480]+bestaudio/best[height<=480]'
        }
      ],
      qualityIndex: 0
    };
  },
  computed: mapGetters([
    'count',
    'canDownloadMany',
    'isAllAudioChosen',
    'globalQuality',
    'globalQualityIndex'
  ]),
  methods: {
    ...mapMutations(['openConfirm', 'updateGlobalQualityIndex']),
    ...mapActions([
      'downloadMany',
      'pauseMany',
      'clearMany',
      'toggleAllAudioChosen',
      'confirm',
      'setManyQuality'
    ]),
    clearAll() {
      this.close();

      const message = {
        title: 'Clear All',
        content: `Delete all ${this.count} item(s)?`
      };
      const success = () => this.clearMany(true);
      this.openConfirm({ message, success });
    },
    clearCompleted() {
      this.close();

      const message = {
        title: 'Clear Completed',
        content: 'Delete all completed item(s)?'
      };
      const success = () => this.clearMany(false);
      this.openConfirm({ message, success });
    },
    handleDialog(value) {
      const index = this.globalQuality.findIndex(x => x.code === value);

      this.updateGlobalQualityIndex(index);
      this.setManyQuality(this.globalQuality[index]);
    },
    toggleSubsChosen() {
      this.isSubsChosen = !this.isSubsChosen;
    },
    close() {
      this.isOpen = false;
    },
    open() {
      this.isOpen = true;
    }
  }
};
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

hr {
  border: none;
  height: 1px;
  background-color: lightgray;
  margin: 4px 0 6px 0;
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
  width: 165px;
  position: absolute;
  top: 0;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  border-radius: 4px;
  padding: 4px 0;
  z-index: 1;
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

.option button {
  width: 60px;
  height: 28px;
  display: flex;
  border-radius: 4px;
  justify-content: center;
  background-color: transparent;
}

.option button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.option button.active {
  background-color: rgba(0, 0, 0, 0.25);
}

.buttons {
  padding: 0 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.buttons button {
  width: 100%;
  height: 28px;
}

.buttons button:first-of-type {
  margin-bottom: 6px;
}

.buttons button:last-of-type {
  margin-bottom: 2px;
}
</style>
