import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'
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
  const index = computed(() => openedModals.indexOf(modalExposed))

  /** Computed rather than watched, so a modal opened in setup carries its z-index in the server HTML. */
  const zIndex = computed(() => visible.value ? props.zIndexFn?.({ index: Math.max(index.value, 0) }) : undefined)

  return { zIndex }
}
