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
      <div class="item format">
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
    </section>
  </div>
</template>

<script>
import Checkbox from '../components/Checkbox.vue';

export default {
  name: 'settings',
  components: {
   Checkbox 
  },
  data() {
    return {
      simultaneous: 5,
      filenameFormats: [
        { key: '%(title)s.%(ext)s', name: 'Title', active: true },
        { key: '%(id)s.%(ext)s', name: 'ID', active: false },
        { key: '%(title)s-%(id)s.%(ext)s', name: 'Title + ID', active: false },
      ],
      isAscii: false
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
#settings-page {
  padding-top: 16px;
  padding-left: 24px;
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

.format .value button {
  background-color: white;
  height: 26px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid lightgray;
  margin-right: 8px;
}

.format .value button.active {
  background-color: lightgray;
  border-color: transparent;
}
</style>