import type { ComputedRef } from 'vue'
import { computed, ref, watch } from 'vue'
import type CoreModal from './CoreModal.vue'
import type { Modal } from '~/Modal'

export function useZIndex(
  props: InstanceType<typeof CoreModal>['$props'],
  options: { openedModals: ComputedRef<Modal>[]; modalInstance: ComputedRef<Modal> },
) {
  const { openedModals, modalInstance } = options

  const zIndex = ref<undefined | number>()

  const index = computed(() => openedModals.indexOf(modalInstance))

  function refreshZIndex() {
    zIndex.value = props.zIndexFn?.({ index: index.value })
  }

  watch([props.zIndexFn, index], () => {
    refreshZIndex()
  })

  return {
    zIndex,
    refreshZIndex,
  }
}
