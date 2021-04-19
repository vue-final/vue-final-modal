<script>
export default {
  props: {
    labels: {
      type: Array,
      default: () => ['HTML', 'Javascript', 'CSS']
    }
  },
  render(h) {
    const items = this.$slots.default
      .filter(vnode => vnode.text !== '\n')
      .map((vnode, index) => {
        return h(
          'code-block',
          {
            props: {
              label: this.labels[index],
              ...(index === 0 && { active: true })
            }
          },
          [vnode]
        )
      })
    return h('code-group', {}, items)
  }
}
</script>
