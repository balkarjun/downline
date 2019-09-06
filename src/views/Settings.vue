<template>
  <div id="settings-page">
    <section class="general">
      <label>General</label>
      <div class="item download-location">
        <p>Download Location</p>
        <p class="value">C:\Users\Anon\Downloads</p>
        <button>Browse</button>
      </div>
      <div class="item simultaneous-downloads">
        <p>Simultaneous Downloads</p>
        <div class="value">
          <button>-</button>
          <p>5</p>
          <button>+</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'settings'
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

.download-location .value {
  padding-left: 16px;
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
  padding-left: 16px;
}

.simultaneous-downloads .value button {
  height: 25px;
  width: 25px;
  border-radius: 4px;
}

.simultaneous-downloads .value p {
  padding: 0 8px;
}
</style>