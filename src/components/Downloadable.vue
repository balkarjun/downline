<template>
  <div id="box">
    <img id="thumbnail" src="../assets/images/thumbnail.jpg">
    <div id="content">
      <div id="top">
        <p id="duration">10:05</p>
        <p id="title">Is Meat Bad for You? Is Meat Unhealthy?</p>
      </div>
      <div id="bottom">

      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'downloadable',
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
  height: 20px;
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
