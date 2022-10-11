import type CoreModal from './components/CoreModal/CoreModal.vue'

type Event = 'beforeOpen' | 'beforeClose' | 'opened' | 'closed'

export function useEvent(emit: InstanceType<typeof CoreModal>['$emit']) {
  function emitEvent(e: Event) {
    switch (e) {
      case 'beforeOpen':
        emit('internalBeforeOpen')
        emit(e)
        break
      case 'beforeClose':
        emit('internalBeforeClose')
        emit(e)
        break
      case 'opened':
        emit('internalOpened')
        emit(e)
        break
      case 'closed':
        emit('internalClosed')
        emit(e)
        break
    }
  }

  return {
    emitEvent,
  }
}
