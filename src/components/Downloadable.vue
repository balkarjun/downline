<template>
  <div id="box">
    <section id="left">
      <img class="thumbnail" :src="data.thumbnail" />

      <p class="duration" :class="{ hide: !isStopped }">{{ data.duration }}</p>

      <div class="overlay" :class="{ fixed: !isStopped }">
        <img v-if="isCompleted" src="../assets/icons/done.svg" />
        <img
          v-else-if="isStopped || isPaused"
          @click="download(data.url)"
          src="../assets/icons/download.svg"
          class="pointer"
        />
        <img
          v-else
          @click="pause(data.url)"
          src="../assets/icons/pause.svg"
          class="pointer"
        />
      </div>
    </section>

    <OnClickOutside :do="closeContextMenu">
      <div v-show="showContextMenu" ref="contextMenu" class="context-menu">
        <p @click="copyLink">Copy Link</p>
      </div>
    </OnClickOutside>

    <section id="middle" @contextmenu.prevent="openContextMenu($event)">
      <p class="title">{{ data.title }}</p>

      <div v-if="isStopped" class="options">
        <CustomDialog
          :options="filteredFormats"
          :isObject="true"
          :value="activeFormat.code"
          @input="onFormatUpdate"
        />

        <button
          @click="toggleAudioChosen"
          :class="{ active: activeFormat.isAudioOnly }"
        >
          <img src="../assets/icons/music_note.svg" />
        </button>
      </div>

      <div v-else-if="isCompleted">Show in Folder</div>

      <div v-else class="progress">
        <div class="info">
          <p>{{ progressInfo }}</p>
          <p v-if="isDownloading">{{ data.progress.eta }}</p>
        </div>

        <div class="bar">
          <div
            :class="{ indeterminate: isStarting || isProcessing }"
            :style="[
              data.progress ? { width: data.progress.percent + '%' } : ''
            ]"
          ></div>
        </div>
      </div>
    </section>

    <section id="right">
      <img
        @click="reload(data.url)"
        v-if="isPaused || isCompleted"
        src="../assets/icons/reload.svg"
      />
      <img @click="remove(data.url)" src="../assets/icons/delete.svg" />
    </section>
  </div>
</template>

<script>
import OnClickOutside from '../components/OnClickOutside.vue';
import CustomDialog from './CustomDialog.vue';

import State from '../lib/state.js';
const { clipboard } = window.require('electron');

import { mapMutations, mapActions } from 'vuex';

export default {
  name: 'downloadable',
  components: {
    OnClickOutside,
    CustomDialog
  },
  data() {
    return {
      showContextMenu: false
    };
  },
  props: ['data'],
  methods: {
    ...mapMutations(['updateFormatIndex']),
    ...mapActions(['download', 'pause', 'reload', 'remove']),
    toggleAudioChosen() {
      const newFormatIndex = this.data.formats.findIndex(
        x => x.isAudioOnly === !this.activeFormat.isAudioOnly
      );

      this.updateFormatIndex({
        url: this.data.url,
        value: newFormatIndex
      });
    },
    onFormatUpdate(val) {
      const newFormatIndex = this.data.formats.findIndex(x => x.code === val);

      this.updateFormatIndex({
        url: this.data.url,
        value: newFormatIndex
      });
    },
    copyLink() {
      clipboard.writeText(this.data.url);
      this.closeContextMenu();
    },
    openContextMenu() {
      this.showContextMenu = true;
      const element = this.$refs.contextMenu;
      element.style.left = `${event.pageX}px`;
      element.style.top = `${event.pageY}px`;
    },
    closeContextMenu() {
      this.showContextMenu = false;
    }
  },
  computed: {
    isStopped() {
      return State.isStopped(this.data.state);
    },
    isStarting() {
      return State.isStarting(this.data.state);
    },
    isDownloading() {
      return State.isDownloading(this.data.state);
    },
    isProcessing() {
      return State.isProcessing(this.data.state);
    },
    isPaused() {
      return State.isPaused(this.data.state);
    },
    isQueued() {
      return State.isQueued(this.data.state);
    },
    isCompleted() {
      return State.isCompleted(this.data.state);
    },
    activeFormat() {
      return this.data.formats[this.data.formatIndex];
    },
    filteredFormats() {
      return this.data.formats.filter(
        x => x.isAudioOnly === this.activeFormat.isAudioOnly
      );
    },
    progressInfo() {
      if (this.isProcessing) {
        return `${this.data.progress.size} \u00B7 Processing`;
      }

      let info = this.data.progress
        ? `${this.data.progress.downloaded} of ${this.data.progress.size} \u00B7 `
        : '';

      if (this.isStarting)
        info += this.data.progress ? 'Resuming' : 'Starting Download';
      else if (this.isDownloading) info += this.data.progress.speed;
      else if (this.isPaused) info += 'Paused';
      else if (this.isQueued) info += 'Queued';

      return info;
    }
  }
};
</script>

<style scoped>
#box {
  height: 82px;
  display: flex;
}

#box:hover {
  background-color: whitesmoke;
}

#left {
  display: flex;
  position: relative;
  margin-left: 16px;
}

.thumbnail {
  min-width: 120px;
  min-height: 70px;
  width: 120px;
  height: 70px;
  border-radius: 4px;
  object-fit: cover;
  align-self: center;
}

.duration {
  font-size: 12px;
  line-height: 16px;
  position: absolute;
  right: 2px;
  bottom: 8px;
  padding: 0 7px;
  border-radius: 4px;
  color: lightgray;
  background-color: rgba(0, 0, 0, 0.85);
  opacity: 1;
}

.duration.hide {
  opacity: 0;
}

#box:hover .duration {
  opacity: 0;
}

.overlay {
  height: 70px;
  width: 120px;
  position: absolute;
  top: 6px;
  opacity: 0;
  display: flex;
  justify-content: center;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.2);
}

.overlay.fixed {
  opacity: 1;
}

#box:hover .overlay {
  opacity: 1;
}

.pointer {
  cursor: pointer;
}

.context-menu {
  width: 110px;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.context-menu p {
  padding-left: 16px;
  line-height: 28px;
  cursor: pointer;
}

.context-menu p:hover {
  background-color: whitesmoke;
}

#middle {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 8px 0 8px 12px;
  justify-content: space-between;
  width: calc(100% - 16px - 120px - 12px - 60px);
}

.title {
  overflow: scroll;
  white-space: nowrap;
}

.options {
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
}

.options button {
  width: 64px;
  height: 28px;
  display: flex;
  border-radius: 4px;
  justify-content: center;
  background-color: transparent;
}

.options button:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.options button.active {
  background-color: rgba(0, 0, 0, 0.25);
}

/* Progess */
.progress {
  display: flex;
  flex-direction: column;
}

.info {
  font-size: 13px;
  color: gray;
  margin-bottom: 2px;
  display: flex;
  justify-content: space-between;
}

.bar {
  height: 6px;
  width: 400px;
  background-color: lightgray;
  border-radius: 2px;
  overflow: hidden;
}

.bar div {
  height: 6px;
  width: 0px;
  background-color: gray;
  border-radius: 2px;
  position: relative;
  top: 0;
  left: 0%;
  will-change: left, right;
}

.bar div.indeterminate {
  width: 20% !important;
  animation: indeterminate 1.5s infinite;
}

@keyframes indeterminate {
  0% {
    transform: translate(-50%, 0%);
    animation-timing-function: linear;
  }
  20% {
    transform: translate(50%, 0%);
    animation-timing-function: linear;
  }
  40% {
    transform: translate(150%, 0%);
    animation-timing-function: linear;
  }
  60% {
    transform: translate(250%, 0%);
    animation-timing-function: linear;
  }
  80% {
    transform: translate(350%, 0%);
    animation-timing-function: linear;
  }
  100% {
    transform: translate(450%, 0%);
    animation-timing-function: linear;
  }
}

#right {
  display: flex;
  width: 60px;
  justify-content: flex-end;
}

#right img {
  padding: 2px;
  align-self: flex-start;
  margin: 5px 5px 0 0;
  opacity: 0;
  cursor: pointer;
}

#box:hover #right img {
  opacity: 1;
}
</style>
