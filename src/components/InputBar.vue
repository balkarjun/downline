<template>
  <div>
    <textarea 
      ref="textarea" 
      @keydown.ctrl.86="isPasted = true" 
      @input="updateValue($event)" 
      @contextmenu.prevent="openContextMenu($event)"
      placeholder="Enter one link per line"
    ></textarea>
    
    <button @click="addLinks">
      <img src="../assets/icons/add.svg">
    </button>

    <OnClickOutside :do="closeContextMenu">
      <div v-show="showContextMenu" ref="contextMenu" class="context-menu">
        <p @click="paste">Paste</p>
      </div>
    </OnClickOutside>
  </div>
</template>

<script>
import OnClickOutside from '../components/OnClickOutside.vue';
const { clipboard } = window.require('electron');

export default {
  name: 'input-bar',
  components: {
    OnClickOutside
  },
  data() {
    return {
      isPasted: false,
      showContextMenu: false
    }
  },
  methods: {
    paste() {
      const text = clipboard.readText();
      this.$refs.textarea.value += text + '\n';
      this.$refs.textarea.focus();
      this.closeContextMenu();
    },
    openContextMenu(event) {
      this.showContextMenu = true;
      const element = this.$refs.contextMenu;
      element.style.left = `${event.pageX - 32}px`;
      element.style.top = `${event.pageY - 32}px`;
    },
    closeContextMenu() {
      this.showContextMenu = false;
    },
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
.context-menu {
  width: 110px;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 4px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: white;
  box-sizing: border-box;
  box-shadow: 0 2px 6px rgba(0, 0, 0, .2);
}

.context-menu p {
  padding-left: 16px;
  line-height: 28px;
  cursor: pointer;
}

.context-menu p:hover {
  background-color: whitesmoke;
}

div {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 16px;
}

textarea {
  font-family: Rubik;
  font-size: 15px;
  height: 100px;
  box-sizing: border-box;
  border-radius: 4px;
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
