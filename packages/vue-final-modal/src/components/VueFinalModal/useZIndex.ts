import { ref } from 'vue'
import type VueFinalModal from './VueFinalModal.vue'

export function useZIndex(
  props: InstanceType<typeof VueFinalModal>['$props'],
) {
  const zIndex = ref<undefined | number>()

  function refreshZIndex(index: number) {
    zIndex.value = props.zIndexFn?.({ index: index <= -1 ? 0 : index })
  }

  function resetZIndex() {
    zIndex.value = undefined
  }

  return {
    zIndex,
    refreshZIndex,
    resetZIndex,
  }
}
