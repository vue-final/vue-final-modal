import { computed, defineComponent, onBeforeUnmount } from 'vue'
import { useVfm } from '~/useApi'

export const ModalsContainer = defineComponent({
  name: 'ModalsContainer',
  setup() {
    const { modalsContainers, dynamicModals } = useVfm()

    const uid = Symbol(__DEV__ ? 'ModalsContainer' : '')
    const shouldMount = computed(() => uid === modalsContainers.value?.[0])

    modalsContainers.value.push(uid)
    onBeforeUnmount(() => {
      modalsContainers.value = modalsContainers.value.filter(i => i !== uid)
    })

    return () => {
      if (!shouldMount.value)
        return null

      return dynamicModals
    }
  },
})
