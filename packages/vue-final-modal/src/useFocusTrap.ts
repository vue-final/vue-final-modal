import type { Ref } from 'vue'
import { nextTick } from 'vue'
import { useFocusTrap as _useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { openedModals } from './api'
import type CoreModal from './components/CoreModal/CoreModal.vue'

export function useFocusTrap(props: InstanceType<typeof CoreModal>['$props'], options: {
  focusEl: Ref<undefined | HTMLDivElement>
}) {
  if (props.focusTrap?.disabled) {
    return {
      focus() {},
      focusLast() {},
      blur() {},
    }
  }

  const { focusEl } = options
  const { hasFocus, activate, deactivate } = _useFocusTrap(focusEl, props.focusTrap)

  function focus() {
    requestAnimationFrame(() => {
      activate()
    })
  }

  function focusLast() {
    // If there are still nested modals opened, focus the last opened modal
    if (openedModals.length <= 0)
      return
    nextTick(() => {
      const modal = openedModals[openedModals.length - 1]
      modal?.value.focus()
    })
  }

  function blur() {
    if (hasFocus.value)
      deactivate()
  }

  return { focus, focusLast, blur }
}
