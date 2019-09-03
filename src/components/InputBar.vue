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
      value: null,
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
        this.$emit('output', this.value);
      }
      this.$refs.textarea.value = '';
    }
  }
};
</script>

<style scoped>
div {
  position: relative;
  display: flex;
  flex-direction: column;
}

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
textarea::-webkit-scrollbar {
  width: 3px;
}

button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  position: absolute;
  bottom: -22px;
  left: calc(50% - 22px);
}
</style>
