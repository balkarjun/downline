<template>
  <div>
    <button>Download All</button>
    
    <p v-show="count > 0">
      {{ count }}
      <span class="light">
        Item{{ count > 1 ? 's' : '' }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: 'option-bar',
  props: ['count']
}
</script>

<style scoped>
div {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 32px 6px 16px;
}

button {
  height: 30px;
  width: 120px;
  border-radius: 4px;
}
</style>
