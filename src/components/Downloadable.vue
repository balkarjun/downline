<template>
  <div id="box">
    <section id="left">
      <img class="thumbnail" :src="data.thumbnail">

      <p class="duration" :class="{hide: !isStopped}">{{ data.duration }}</p>

      <div class="overlay" :class="{fixed: !isStopped}">
        <img v-if="isCompleted" src="../assets/icons/done.svg">
        <img v-else-if="isStopped || isPaused" @click="download" src="../assets/icons/download.svg" class="pointer">
        <img v-else @click="pause" src="../assets/icons/pause.svg" class="pointer">
      </div>
    </section>

    <section id="middle">
      <p class="title">{{ data.title }}</p>

      <div v-if="isStopped" class="options">
        <CustomDialog :options="filteredFormats" :isObject="true" v-model="activeIndex" />

        <button @click="toggleAudioChosen" :class="{active: isAudioChosen}">
          <img src="../assets/icons/music_note.svg">
        </button>
      </div>

      <div v-else-if="isCompleted">
        Show in Folder
      </div>

      <div v-else class="progress">
        <div class="info">
          <p v-if="isStarting && progress">
            {{ progress.downloaded }} of {{ progress.size }} &centerdot; Resuming
          </p>

          <p v-else-if="isStarting">Starting Download</p>

          <p v-else-if="isDownloading">
            {{ progress.downloaded }} of {{ progress.size }} &centerdot; {{ progress.speed }}
            <span class="end">{{ progress.eta }}</span>
          </p>

          <p v-else-if="isPaused || isQueued">
            <span v-if="progress">
              {{ progress.downloaded }} of {{ progress.size }} &centerdot;
            </span>
            {{ isPaused ? 'Paused' : 'Queued' }}
          </p>

          <p v-else-if="isProcessing">
            {{ progress.size }} &centerdot; Processing
          </p>
        </div>

        <div class="back">
          <div 
            class="front" 
            :class="{indeterminate: isStarting || isProcessing}"
            :style="[progress ? { width: progress.percent + '%' } : '']"
          ></div>
        </div>
      </div>
    </section>
    
    <section id="right">
      <img @click="reload" v-if="isPaused || isCompleted" src="../assets/icons/reload.svg">
      <img @click="remove" src="../assets/icons/delete.svg">
    </section>
  </div>
</template>

<script>
import CustomDialog from './CustomDialog.vue';
import EventBus from '../lib/bus.js';

const { remote } = window.require('electron');
const api = remote.require('./api.js');

const State = {
  STOPPED: 0,
  STARTING: 1,
  DOWNLOADING: 2,
  PROCESSING: 3,
  PAUSED: 4,
  QUEUED: 5,
  COMPLETED: 6
}

export default {
  name: 'downloadable',
  components: {
    CustomDialog
  },
  props: ['data'],
  mounted() {
    api.queueEvent.on('dequeue', this.queueHandler);

    EventBus.$on('downloadMany', this.downloadManyHandler);
  },
  beforeDestroy() {
    api.queueEvent.removeListener('dequeue', this.queueHandler);

    EventBus.$off('downloadMany', this.downloadManyHandler);
  },
  data() {
    return {
      isAudioChosen: false,
      activeIndex: 0,
      state: State.STOPPED,
      progress: null
    }
  },
  methods: {
    downloadManyHandler() {
      if (this.isStopped || this.isPaused) {
        this.download();
      }
    },
    queueHandler(url) {
      if (this.data.url === url && this.isQueued) {
        this.download();
      }
    },
    download() {
      const args = {
        url: this.data.url,
        formatCode: this.filteredFormats[this.activeIndex].code,
        isAudio: this.isAudioChosen,
        playlist: this.data.playlist
      };
   
      const process = api.download(args);
      if (process === null) {
        this.state = State.QUEUED;
        return;
      }
      
      this.state = State.STARTING;
      process.on('data', data => {
        if (data === 'processing') {
          this.state = State.PROCESSING;
        } else if (data !== '') {
          this.progress = data;
          this.state = State.DOWNLOADING;
        }
      });

      process.on('end', () => {
        if (!this.isPaused) {
          this.state = State.COMPLETED;
        }
      });
    },
    pause() {
      this.state = State.PAUSED;
      api.pause(this.data.url);
    },
    remove() {
      this.$emit('remove', this.data.url);
    },
    reload() {
      this.state = State.STOPPED;
      this.progress = null;
    },
    toggleAudioChosen() {
      this.isAudioChosen = !this.isAudioChosen;
      this.activeIndex = 0;
    }
  },
  computed: {
    isStopped() {
      return this.state === State.STOPPED;
    },
    isStarting() {
      return this.state === State.STARTING;
    },
    isDownloading() {
      return this.state === State.DOWNLOADING;
    },
    isProcessing() {
      return this.state === State.PROCESSING;
    },
    isPaused() {
      return this.state === State.PAUSED;
    },
    isQueued() {
      return this.state === State.QUEUED;
    },
    isCompleted() {
      return this.state === State.COMPLETED;
    },
    filteredFormats() {
      return this.data.formats.filter(x => x.isAudioOnly === this.isAudioChosen);
    }
  }
}
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

#box:hover .duration{
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
}

.info p {
  display: flex;
}

.end {
  margin-left: auto;
}

.back {
  height: 6px;
  width: 400px;
  background-color: lightgray;
  border-radius: 2px;
  overflow: hidden;
}

.front {
  height: 6px;
  width: 0px;
  background-color: gray;
  border-radius: 2px;
  position: relative;
  top: 0;
  left: 0%;
  will-change: left, right;
}

.front.indeterminate {
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
