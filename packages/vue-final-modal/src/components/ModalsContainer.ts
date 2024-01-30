import { computed, defineComponent, onBeforeUnmount } from 'vue'
import { useVfm } from '~/useVfm'

export const ModalsContainer = defineComponent({
  name: 'ModalsContainer',
  setup() {
    const { vNodesContainer } = useVfm()

    const uid = Symbol(__DEV__ ? 'VNodesContainer' : '')
    const shouldMount = computed(() => uid === vNodesContainer.containers.value?.[0])

    vNodesContainer.containers.value.push(uid)
    onBeforeUnmount(() => {
      vNodesContainer.containers.value = vNodesContainer.containers.value.filter(i => i !== uid)
    })

    return () => {
      if (!shouldMount.value)
        return null
      return vNodesContainer.vNodes
    }
  },
})
