<template>
  <div id="box">
    <img id="thumbnail" :src="thumbnail">
    <div id="content">
      <div id="top">
        <p id="duration">{{ duration }}</p>
        <p id="title">{{ title }}</p>
      </div>
      <div id="bottom">
        <QualitySelect />
      </div>
    </div>
  </div>
</template>

<script>
import QualitySelect from './QualitySelect.vue';

export default {
  name: 'downloadable',
  components: {
    QualitySelect
  },
  props: [
    'title',
    'thumbnail',
    'duration'
  ],
  data() {
    return {

    }
  }
}
</script>

<style scoped>
p {
  margin: 0;
  padding: 0;
}

#box {
  height: 86px;
  display: flex;
}

#thumbnail {
  min-width: 74px;
  min-height: 74px;
  width: 74px;
  height: 74px;
  border-radius: 50%;
  object-fit: cover;
  margin-left: 12px;
  align-self: center;
}

#content {
  display: flex;
  flex-direction: column;
  height: 66px;
  width: 100%;
  margin-left: 12px;
  align-self: center;
  justify-content: space-between;
}

#top {
  display: block;
}

#bottom {
  display: flex;
}

#duration {
  display: inline;
  font-size: 14px;
}

#title {
  display: inline;
  margin-left: 4px;
}
</style>
