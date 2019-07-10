<template>
  <div>
    <div v-if="activeInput===0" id="single-link">
      <input type="text" placeholder="Type or paste a link">
      <div @click="nextInput" class="swap-button">
        <img src="../assets/icons/swap_horiz.svg">
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
          &plus;
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
  align-self: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
}

.swap-button img {
  width: 18px;
  height: 18px;
  align-self: center;
  margin: 0 auto;
}

#single-link .swap-button {
  position: absolute;
  right: 116px;
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

#multiple-links .buttons {
  width: 52px;
  border: 1px solid lightgray;
  border-radius: 0 5px 5px 0;
  border-left: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

#multiple-links .swap-button {
  margin-top: 8px;
}

#multiple-links .add-links {
  width: 44px;
  height: 44px;
  border-radius: 5px;
  margin-bottom: 8px;
  margin-right: 8px;
}
</style>
