import type { Ref } from 'vue'
import { ref } from 'vue'
import type VueFinalModal from './components/VueFinalModal.vue'

type Event = 'beforeOpen' | 'beforeClose' | 'opened' | 'closed'

export function useEvent(emit: InstanceType<typeof VueFinalModal>['$emit'], options: {
  modelValueLocal: Ref<boolean>
}) {
  const { modelValueLocal } = options
  const stopEvent = ref(false)

  function emitEvent(e: Event) {
    let _stopEvent = false
    switch (e) {
      case 'beforeOpen':
        emit(`_${e}`)
        emit(e, { stop: () => _stopEvent = true })
        if (_stopEvent) {
          stopEvent.value = true
          modelValueLocal.value = false
        }
        break
      case 'beforeClose':
        emit(`_${e}`)
        emit(e, { stop: () => _stopEvent = true })
        if (_stopEvent) {
          stopEvent.value = true
          modelValueLocal.value = true
        }
        break
      case 'opened':
        emit(`_${e}`)
        emit(e)
        break
      case 'closed':
        emit(`_${e}`)
        emit(e)
        break
    }
    return _stopEvent
  }

  return {
    stopEvent,
    emitEvent,
  }
}
