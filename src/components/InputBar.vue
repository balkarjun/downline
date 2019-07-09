<template>
  <div>
    <div id="single-link">
      <input type="text">
      <img src="../assets/icons/swap_horiz.svg">
      <button>Add Link</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'input-bar'
};
</script>

<style scoped>
  input {
    box-sizing: border-box;
    font-size: 15px;
  }

  #single-link {
    display: flex;
    margin: 0 16px;
  }

  #single-link input {
    height: 44px;
    padding: 16px;
    flex-grow: 1;
  }

  #single-link button {
    padding: 0 16px;
  }
</style>
