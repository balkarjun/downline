<template>
  <div>
    <div id="single-link">
      <input type="text" placeholder="Type or paste a link">
      <div class="swap-button">
        <img src="../assets/icons/swap_horiz.svg">
      </div>
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

.swap-button {
  background-color: lightgray;
  display: flex;
  align-self: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  position: absolute;
  right: 116px;
}

.swap-button img {
  width: 20px;
  height: 20px;
  align-self: center;
  margin: 0 auto;
}

#single-link {
  display: flex;
  margin: 0 16px;
}

#single-link input {
  height: 44px;
  padding: 16px;
  flex-grow: 1;
  border-radius: 5px 0 0 5px;
  border: 1px solid lightgray;
}

#single-link button {
  padding: 0 16px;
  border-radius: 0 5px 5px 0;
}
</style>
