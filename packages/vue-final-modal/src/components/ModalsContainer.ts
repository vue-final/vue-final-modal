import { computed, defineComponent, h, onBeforeUnmount } from 'vue'
import type { VfmInternal } from '../plugin'
import { useVfmRequest } from '../plugin'
import { useVfm } from '../composables/useVfm'

export const ModalsContainer = defineComponent({
  name: 'ModalsContainer',
  setup() {
    const vfm = useVfm() as VfmInternal
    const uid = Symbol('ModalsContainer')

    const request = useVfmRequest(vfm)
    if (request) {
      request.containers.push(uid)
      return () => uid === request.containers[0] ? h(vfm._TemplateOutlet) : null
    }

    const shouldMount = computed(() => uid === vfm._containers.value?.[0])

    vfm._containers.value.push(uid)
    onBeforeUnmount(() => {
      vfm._containers.value = vfm._containers.value.filter(i => i !== uid)
    })

    return () => shouldMount.value ? h(vfm._TemplateOutlet) : null
  },
})
