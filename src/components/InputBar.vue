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
      isPasted: false
    }
  },
  methods: {
    updateValue(event) {
      if (this.isPasted) event.target.value += '\n';
      this.isPasted = false;
    },
    addLinks() {
      const value = this.$refs.textarea.value.split('\n')
      .map(x => x.trim()).filter(x => x.length > 0);

      if (value.length > 0) this.$emit('output', value);
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
  box-sizing: border-box;
  border-radius: 4px;
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
