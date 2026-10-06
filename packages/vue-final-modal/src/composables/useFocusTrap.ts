import type { Ref } from 'vue'
import { useFocusTrap as _useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps } from '~/types'

export function useFocusTrap(
  props: ComponentProps<typeof VueFinalModal>,
  options: {
    focusEl: Ref<undefined | HTMLDivElement>
  },
) {
  if (props.focusTrap === false) {
    return {
      focus() {},
      blur() {},
    }
  }

  const { focusEl } = options
  const { hasFocus, activate, deactivate } = _useFocusTrap(focusEl, props.focusTrap)
  let pendingFrame: number | undefined

  function cancelPendingFocus() {
    if (pendingFrame === undefined)
      return
    cancelAnimationFrame(pendingFrame)
    pendingFrame = undefined
  }

  function focus() {
    cancelPendingFocus()
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = undefined
      activate()
    })
  }

  function blur() {
    /** A trap activated after close() would pause the parent modal's trap and lose focus once this modal's element is removed. */
    cancelPendingFocus()
    if (hasFocus.value)
      deactivate()
  }

  return { focus, blur }
}
