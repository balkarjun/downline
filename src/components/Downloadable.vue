<template>
  <div id="box">
    <section id="left">
      <img class="thumbnail" :src="data.thumbnail">
      <div class="duration" :class="{hide: isOverlayFixed}">
        <p>{{ data.duration }}</p>
      </div>
      <div class="overlay" :class="{fixed: isOverlayFixed}">
        <button @click="handleClick" class="circle">
          <img :src="stateIcon">
        </button>
      </div>
    </section>
    <section id="middle">
      <p class="title">{{ data.title }}</p>
      <div v-if="isProgressVisible" class="progress">
        <div class="info">Starting Download</div>
        <div class="back">
          <div class="front indeterminate"></div>
        </div>
      </div>
      <div v-else class="options">
        <QualitySelect :formats="filteredFormats" />
        <button @click="isAudioChosen = !isAudioChosen" :class="{active: isAudioChosen}">
          <img src="../assets/icons/music_note.svg">
        </button>
      </div>
    </section>
  </div>
</template>

<script>
import QualitySelect from './QualitySelect.vue';

const State = {
  STOPPED: 0,
  DOWNLOADING: 1,
  QUEUED: 2,
  PAUSED: 3,
  COMPLETED: 4
};

export default {
  name: 'downloadable',
  components: {
    QualitySelect
  },
  props: ['data'],
  data() {
    return {
      isAudioChosen: false,
      state: State.STOPPED,
      stateIcon: require('../assets/icons/download.svg'),
      isOverlayFixed: false
    }
  },
  methods: {
    handleClick() {
      let icon = ''
      if (this.state === State.STOPPED) {
        this.state = State.DOWNLOADING;
        icon = 'pause';
        this.isOverlayFixed = true;
        this.download();
        console.log('stopped -> downloading');
      } 
      else if (this.state === State.DOWNLOADING) {
        this.state = State.PAUSED;
        icon = 'download';
        this.isOverlayFixed = true;
        console.log('downloading -> paused');
      } 
      else if (this.state === State.PAUSED) {
        this.state = State.DOWNLOADING;
        icon = 'pause';
        this.isOverlayFixed = true;
        this.download();
        console.log('paused -> downloading');
      }

      this.stateIcon = require(`../assets/icons/${icon}.svg`);
    },
    download() {
      this.$emit('download', {
        url: this.data.url,
        formatCode: 'bestaudio[abr<=160]'
      });
    }
  },
  computed: {
    filteredFormats() {
      return this.data.formats.filter(x => x.isAudioOnly === this.isAudioChosen);
    },
    isProgressVisible() {
      return this.state !== State.STOPPED && this.state !== State.COMPLETED;
    }
  }
}
</script>

<style scoped>
#box {
  height: 82px;
  display: flex;
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
  border-radius: 5px;
  object-fit: cover;
  align-self: center;
}

.duration {
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 5px;
  position: absolute;
  right: 2px;
  bottom: 8px;
  opacity: 1;
  padding: 1px 8px;
}

.duration p{
  font-size: 12px;
  color: lightgray;
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
  background-color: rgba(0, 0, 0, 0.2);
}

.overlay.fixed {
  opacity: 1;
}

#box:hover .overlay {
  opacity: 1;
}

.circle {
  width: 50px;
  height: 50px;
  background-color: white;
  align-self: center;
  border-radius: 50%;
  display: flex;
  justify-content: center;
}

#middle {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 8px 0 8px 12px;
  justify-content: space-between;
  width: calc(100% - 16px - 120px - 12px);
}

.title {
  overflow: scroll;
  white-space: nowrap;
}

.options {
  display: flex;
  justify-content: space-between;
  margin-right: 50px;
}

.options button {
  width: 64px;
  height: 28px;
  display: flex;
  border-radius: 5px;
  justify-content: center;
  background-color: white;
}

.options button:hover {
  background-color: whitesmoke;
}

.options button.active {
  background-color: lightgray;
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

.back {
  height: 6px;
  width: 450px;
  background-color: lightgray;
  border-radius: 2px;
  overflow: hidden;
}

.front {
  height: 6px;
  width: 200px;
  background-color: gray;
  border-radius: 2px;
}

.front.indeterminate {
  position: relative;
  width: 20%;
  top: 0;
  left: 0%;
  will-change: left, right;
  animation: indeterminate 1.5s linear infinite;
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
</style>
