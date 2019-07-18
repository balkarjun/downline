<template>
  <div>
    <textarea 
      ref="textarea" 
      @keydown.ctrl.86="isPasted = true" 
      @input="updateValue($event)" 
      placeholder="Enter one link per line"
    ></textarea>
    <button @click="addLinks">
      <img src="../assets/icons/add.svg">
    </button>
  </div>
</template>

<script>
export default {
  name: 'input-bar',
  data() {
    return {
      value: [],
      isPasted: false
    }
  },
  methods: {
    updateValue(event) {
      event.target.value += this.isPasted ? '\n' : '';
      this.isPasted = false;
    },
    addLinks() {
      const value = this.$refs.textarea.value.trim();
      if (value !== '') {
        this.value = value.split('\n');
      }
      this.$refs.textarea.value = '';
      this.$emit('output', this.value);
    }
  }
};
</script>

<style scoped>
textarea {
  font-family: Rubik;
  font-size: 15px;
  height: 100px;
  width: calc(100% - 32px);
  box-sizing: border-box;
  border-radius: 5px;
  margin: 0 16px;
  padding: 12px 0 0 16px;
  border: 1px solid lightgray;
  outline: none;
  white-space: nowrap;
  resize: none;
}
textarea:focus {
  border: 1px solid lightblue;
}
/* Width */
textarea::-webkit-scrollbar {
  width: 3px;
  height: 0;
}
/* Handle */
textarea::-webkit-scrollbar-thumb {
  background: lightgray;
  border-radius: 5px;
}

button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  margin: 0 auto;
  position: relative;
  bottom: 26px;
}

button img {
  width: 28px;
  height: 28px;
}
</style>
