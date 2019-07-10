<template>
  <div>
    <!-- <div id="single-link">
      <input type="text" placeholder="Type or paste a link">
      <div class="swap-button">
        <img src="../assets/icons/swap_horiz.svg">
      </div>
      <button>Add Link</button>
    </div> -->
    <div id="multiple-links">
      <textarea placeholder="Type or paste one link per line"></textarea>
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
  font-family: Rubik;
}

textarea {
  height: 100px;
  width: 100%;
  border-radius: 5px;
  padding: 12px 0 0 16px;
  box-sizing: border-box;
  font-family: Rubik;
  font-size: 15px;
  white-space: nowrap;
  resize: none;
  border: 1px solid lightgray;
}
/* Width */
textarea::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
/* Handle */
textarea::-webkit-scrollbar-thumb {
  background: lightgray;
  border-radius: 5px;
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
  cursor: pointer;
}

.swap-button img {
  width: 18px;
  height: 18px;
  align-self: center;
  margin: 0 auto;
}

#single-link {
  display: flex;
  margin: 0 16px;
}

#single-link input {
  height: 44px;
  padding: 0 36px 0 16px;
  flex-grow: 1;
  border-radius: 5px 0 0 5px;
  border: 1px solid lightgray;
}

#single-link button {
  padding: 0 16px;
  border-radius: 0 5px 5px 0;
}

#multiple-links {
  display: flex;
  margin: 0 16px;
}
</style>
