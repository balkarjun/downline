<template>
  <div>
    <button>Download All</button>
    <p v-if="count > 0" id="item-count">
      {{ count }}
      <span class="light">{{ `Item${count > 1 ? 's': ''}` }}</span>
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
  width: calc(100% - 32px);
  margin: 12px 16px 6px 16px;
  display: flex;
  justify-content: space-between;
}

button {
  height: 30px;
  width: 120px;
  border-radius: 5px;
}

#item-count {
  align-self: center;
  margin-right: 16px;
}

.light {
  color: gray;
}
</style>
