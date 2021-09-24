<script>
import { h } from 'vue'
import prism from 'prismjs'

export default {
  setup(props, { slots }) {
    return () => {
      const code = prism.highlight(slots.default()[0].children, prism.languages.markup, 'markup')

      return h(
        'div',
        {
          class: 'language-vue'
        },
        h('pre', h('code', { innerHTML: code }))
      )
    }
  }
}
</script>
