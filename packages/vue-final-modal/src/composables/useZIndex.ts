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
    if (!visible.value)
      return
    refreshZIndex(index.value)
  })

  function refreshZIndex(index: number) {
    zIndex.value = props.zIndexFn?.({ index: index <= -1 ? 0 : index })
  }

  function resetZIndex() {
    zIndex.value = undefined
  }

  return {
    zIndex,
    resetZIndex,
  }
}
