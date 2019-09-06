<template>
  <div id="settings-page">
    <section class="general">
      <label>General</label>
      <div class="download-location">
        <p>Download Location</p>
        <p class="value">C:\Users\Anon\Downloads</p>
        <button>Browse</button>
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

.download-location {
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

</style>