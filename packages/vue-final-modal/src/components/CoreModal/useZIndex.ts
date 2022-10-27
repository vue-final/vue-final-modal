import type { ComputedRef } from 'vue'
import { ref } from 'vue'
import type CoreModal from './CoreModal.vue'
import type { Modal } from '~/Modal'

export function useZIndex(
  props: InstanceType<typeof CoreModal>['$props'],
  options: { openedModals: ComputedRef<Modal>[] },
) {
  const { openedModals } = options
  const zIndex = ref<undefined | number>()

  function refreshZIndex() {
    zIndex.value = props.zIndexFn?.({ index: openedModals.length })
  }

  return {
    zIndex,
    refreshZIndex,
  }
}
