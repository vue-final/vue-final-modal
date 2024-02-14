import type { Ref } from 'vue'
import { computed, toRef } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps, ModalExposed } from '~/types'
import { noop, once } from '~/utils'

export const useInternalExposed = function (
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

  let resolveToggle: (res: string) => void = noop

  function toggle(show?: boolean): Promise<string> {
    return new Promise((resolve) => {
      resolveToggle = once((res: string) => resolve(res))

      const value = typeof show === 'boolean' ? show : !modelValueLocal.value
      modelValueLocal.value = value
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
    resolveToggle,
    modalExposed,
  }
}
