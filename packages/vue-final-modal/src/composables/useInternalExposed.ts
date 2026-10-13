import type { Ref } from 'vue'
import type { ModalExposed, ModalId } from '~/types'
import { computed, toRef } from 'vue'

export function useInternalExposed(
  props: {
    modalId?: ModalId
    hideOverlay?: boolean
    overlayBehavior?: 'auto' | 'persist'
  },
  options: {
    overlayVisible: Ref<boolean>
    toggle: (show?: boolean) => Promise<string>
  },
) {
  const { overlayVisible, toggle } = options

  const modalId = toRef(() => props.modalId)
  const hideOverlay = toRef(() => props.hideOverlay)
  const overlayBehavior = toRef(() => props.overlayBehavior)

  const modalExposed = computed<ModalExposed>(() => ({
    modalId,
    hideOverlay,
    overlayBehavior,
    overlayVisible,
    toggle,
  }))

  return { modalExposed }
}
