<template>
  <div>
    <div v-if="activeInput===0" id="single-link">
      <input type="text" placeholder="Type or paste a link">
      <div class="buttons">
        <div @click="nextInput" class="swap-button">
          <img src="../assets/icons/swap_horiz.svg">
        </div>
      </div>
      <button>Add Link</button>
    </div>
    <div v-else-if="activeInput===1" id="multiple-links">
      <textarea placeholder="Type or paste one link per line"></textarea>
      <div class="buttons">
        <div @click="nextInput" class="swap-button">
          <img src="../assets/icons/swap_horiz.svg">
        </div>
        <button class="add-links">
          <img src="../assets/icons/add.svg">
        </button>
      </div>
    </div>
    <div v-else></div>
  </div>
</template>

<script>
export default {
  name: 'input-bar',
  data() {
    return {
      activeInput: 1
    }
  },
  methods: {
    nextInput() {
      this.activeInput = (this.activeInput + 1) % 2;
    }
  }
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
  border-radius: 5px 0 0 5px;
  padding: 12px 0 0 16px;
  box-sizing: border-box;
  font-family: Rubik;
  font-size: 15px;
  white-space: nowrap;
  resize: none;
  border: 1px solid lightgray;
  border-right: none;
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
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  align-self: center;
}

.swap-button img {
  width: 18px;
  height: 18px;
  align-self: center;
  margin: 0 auto;
}

.buttons {
  display: flex;
}

#single-link {
  display: flex;
  margin: 0 16px;
}

#single-link .buttons {
  padding: 0 8px;
  border: 1px solid lightgray;
  border-left: none;
  border-right: none;
}

#single-link input {
  height: 44px;
  padding-left: 16px;
  flex-grow: 1;
  border-radius: 5px 0 0 5px;
  border: 1px solid lightgray;
  border-right: none;
}

#single-link button {
  padding: 0 16px;
  border-radius: 0 5px 5px 0;
}

#multiple-links {
  display: flex;
  margin: 0 16px;
}

#multiple-links .buttons {
  width: 52px;
  border: 1px solid lightgray;
  border-left: none;
  border-radius: 0 5px 5px 0;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

#multiple-links .swap-button {
  margin: 8px 8px 0 0;
  align-self: flex-end;
}

#multiple-links .add-links {
  width: 44px;
  height: 44px;
  border-radius: 5px;
  margin: 0 8px 8px 0;
  display: flex;
  justify-content: center;
}

#multiple-links .add-links img {
  width: 30px;
  height: 30px;
}
</style>
