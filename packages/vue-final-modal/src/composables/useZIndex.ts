import type { ComputedRef, Ref } from 'vue'
import { computed, ref, watch } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps, ModalExposed } from '~/types'

export function useZIndex(
  props: ComponentProps<typeof VueFinalModal>,
  context: {
    visible: Ref<boolean>
    modalExposed: ComputedRef<ModalExposed>
    openedModals: ComputedRef<ModalExposed>[]
  },
) {
  const { visible, modalExposed, openedModals } = context
  const zIndex = ref<undefined | number>()
  const index = computed(() => openedModals.indexOf(modalExposed))

  watch([() => props.zIndexFn, index], () => {
    if (visible.value)
      zIndex.value = props.zIndexFn?.({ index: Math.max(index.value, 0) })
  })

  function resetZIndex() {
    zIndex.value = undefined
  }

  return {
    zIndex,
    resetZIndex,
  }
}
