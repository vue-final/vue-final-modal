import type { Ref } from 'vue'
import { ref } from 'vue'
import type VueFinalModal from './components/VueFinalModal.vue'

type Event = 'beforeOpen' | 'beforeClose' | 'opened' | 'closed'

export function useEvent(emit: InstanceType<typeof VueFinalModal>['$emit'], options: {
  modelValueLocal: Ref<boolean>
  onStop: (beforeEvent: Event) => void
}) {
  const {
    modelValueLocal,
    onStop,
  } = options
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
          onStop(e)
        }
        break
      case 'beforeClose':
        emit(`_${e}`)
        emit(e, { stop: () => _stopEvent = true })
        if (_stopEvent) {
          stopEvent.value = true
          modelValueLocal.value = true
          onStop(e)
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
  }

  return {
    stopEvent,
    emitEvent,
  }
}
