<template>
  <div id="box">
    <section id="left">
      <img id="thumbnail" :src="data.thumbnail">
      <div id="duration">
        <p>{{ data.duration }}</p>
      </div>
    </section>
    <section id="middle">
      <p id="title">{{ data.title }}</p>
      <div id="bottom">
        <QualitySelect :formats="data.formats" />
      </div>
    </section>
  </div>
</template>

<script>
import QualitySelect from './QualitySelect.vue';

export default {
  name: 'downloadable',
  components: {
    QualitySelect
  },
  props: ['data'],
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
  height: 82px;
  display: flex;
}

#left {
  display: flex;
  position: relative;
  margin-left: 16px;
}

#thumbnail {
  min-width: 120px;
  min-height: 70px;
  width: 120px;
  height: 70px;
  border-radius: 5px;
  object-fit: cover;
  align-self: center;
  position: relative;
}

#duration {
  height: 16px;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 5px;
  position: absolute;
  right: 2px;
  bottom: 8px;
}

#duration p{
  font-size: 12px;
  color: lightgray;
  padding: 0 8px;
  line-height: 16px;
}

#middle {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0 10px 12px;
  justify-content: space-between;
  width: calc(100% - 16px - 120px - 12px);
}

#title {
  overflow: scroll;
  white-space: nowrap;
}

#bottom {
  display: flex;
}
</style>
