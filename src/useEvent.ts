import { ref } from 'vue'
import type VueFinalModal from './components/VueFinalModal.vue'

export function useEvent(emit: InstanceType<typeof VueFinalModal>['$emit']) {
  const stopEvent = ref(false)

  function emitBeforeEvent(e: 'beforeOpen' | 'beforeClose', modelValue: boolean): { stopEvent: boolean } {
    let _stopEvent = false

    emit(e as any, { stop: () => _stopEvent = true })

    if (_stopEvent) {
      stopEvent.value = true
      emit('update:modelValue', modelValue)
    }

    return { stopEvent: _stopEvent }
  }

  return {
    stopEvent,
    emitBeforeEvent,
  }
}
