import type { ComponentEmit } from 'vue-component-type-helpers'
import type CoreModal from './CoreModal.vue'

type Event = 'beforeOpen' | 'beforeClose' | 'opened' | 'closed'

export function useEvent(emit: ComponentEmit<typeof CoreModal>) {
  function emitEvent(e: Event) {
    switch (e) {
      case 'beforeOpen':
        emit(e)
        break
      case 'beforeClose':
        emit(e)
        break
      case 'opened':
        emit(e)
        break
      case 'closed':
        emit(e)
        break
    }
  }

  return {
    emitEvent,
  }
}
