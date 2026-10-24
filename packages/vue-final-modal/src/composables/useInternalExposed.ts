import type { Ref } from 'vue'
import type { ModalExposed, ModalId, ModalStatus, ModalToggle } from '~/types'
import { computed, toRef } from 'vue'

export function useInternalExposed(
  props: {
    modalId?: ModalId
    hideOverlay?: boolean
    overlayBehavior?: 'auto' | 'persist'
  },
  options: {
    overlayVisible: Ref<boolean>
    status: Readonly<Ref<ModalStatus>>
    toggle: ModalToggle
  },
) {
  const { overlayVisible, status, toggle } = options

  const modalId = toRef(() => props.modalId)
  const hideOverlay = toRef(() => props.hideOverlay)
  const overlayBehavior = toRef(() => props.overlayBehavior)

  const modalExposed = computed<ModalExposed>(() => ({
    modalId,
    hideOverlay,
    overlayBehavior,
    overlayVisible,
    status,
    toggle,
  }))

  return { modalExposed }
}
