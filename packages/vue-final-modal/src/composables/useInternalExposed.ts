import type { Ref } from 'vue'
import { computed, toRef } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps, ModalExposed } from '~/types'
import { ALREADY_CLOSED, ALREADY_OPENED, TOGGLED_AGAIN, noop } from '~/utils'

export function useInternalExposed(
  props: ComponentProps<typeof VueFinalModal>,
  options: {
    overlayVisible: Ref<boolean>
    modelValueLocal: Ref<boolean>
  },
) {
  const { overlayVisible, modelValueLocal } = options

  const modalId = toRef(() => props.modalId)
  const hideOverlay = toRef(() => props.hideOverlay)
  const overlayBehavior = toRef(() => props.overlayBehavior)

  let resolvePendingToggle: (result: string) => void = noop

  function toggle(show = !modelValueLocal.value): Promise<string> {
    if (modelValueLocal.value === show)
      return Promise.resolve(show ? ALREADY_OPENED : ALREADY_CLOSED)
    resolvePendingToggle(TOGGLED_AGAIN)
    return new Promise((resolve) => {
      resolvePendingToggle = resolve
      modelValueLocal.value = show
    })
  }

  const modalExposed = computed<ModalExposed>(() => ({
    modalId,
    hideOverlay,
    overlayBehavior,
    overlayVisible,
    toggle,
  }))

  return {
    modalExposed,
    resolveToggle(result: string) {
      resolvePendingToggle(result)
      resolvePendingToggle = noop
    },
  }
}
