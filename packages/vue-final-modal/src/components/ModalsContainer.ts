import { computed, defineComponent, onBeforeUnmount } from 'vue'
import { useVfm } from '~/useApi'

export const ModalsContainer = defineComponent({
  name: 'ModalsContainer',
  setup() {
    const { h } = useVfm()

    const uid = Symbol(__DEV__ ? 'ModalsContainer' : '')
    const shouldMount = computed(() => uid === h.containers.value?.[0])

    h.containers.value.push(uid)
    onBeforeUnmount(() => {
      h.containers.value = h.containers.value.filter(i => i !== uid)
    })

    return () => {
      if (!shouldMount.value)
        return null
      return h.vNodes
    }
  },
})
