import { ref } from 'vue'
import { openedModals } from './api'
import type CoreModal from './components/CoreModal/CoreModal.vue'

export function useZIndex(props: InstanceType<typeof CoreModal>['$props']) {
  const zIndex = ref<undefined | number>()

  function refreshZIndex() {
    zIndex.value = props.zIndexFn?.({ index: openedModals.length })
  }

  return {
    zIndex,
    refreshZIndex,
  }
}
