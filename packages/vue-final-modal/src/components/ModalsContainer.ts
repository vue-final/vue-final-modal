import { defineComponent, h } from 'vue'
import { useVfm } from '~/composables/useVfm'

export const ModalsContainer = defineComponent({
  name: 'ModalsContainer',
  setup() {
    const { Container } = useVfm()
    return () => Container ? h(Container) : null
  },
})
