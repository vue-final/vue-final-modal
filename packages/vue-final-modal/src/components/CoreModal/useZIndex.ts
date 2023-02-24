import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import type CoreModal from './CoreModal.vue'
import type { Modal } from '~/Modal'

export function useZIndex(
  props: InstanceType<typeof CoreModal>['$props'],
  options: {
    openedModals: ComputedRef<Modal>[]
    modalInstance: ComputedRef<Modal>
    visible: Ref<boolean>
  },
) {
  const { openedModals, modalInstance, visible } = options

  const zIndex = ref<undefined | number>()

  const index = computed(() => openedModals.indexOf(modalInstance))

  function refreshZIndex() {
    zIndex.value = props.zIndexFn?.({ index: index.value })
  }

  watch([props.zIndexFn, index], () => {
    if (visible.value)
      refreshZIndex()
  })

  return {
    zIndex,
    refreshZIndex,
  }
}
