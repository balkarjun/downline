<script>
export default {
  props: ['do'],
  mounted() {
    const listener = e => {
      // If click happens outside the element
      if (e.target !== this.$el && !this.$el.contains(e.target)) {
        this.do();
      }
    };
    document.addEventListener('mousedown', listener);
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousedown', listener);
    });
  },
  render() {
    return this.$slots.default[0];
  }
};
</script>
