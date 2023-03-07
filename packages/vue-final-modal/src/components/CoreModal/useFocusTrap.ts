import type { Ref } from 'vue'
import { useFocusTrap as _useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type CoreModal from './CoreModal.vue'

export function useFocusTrap(
  props: InstanceType<typeof CoreModal>['$props'],
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

  function focus() {
    requestAnimationFrame(() => {
      activate()
    })
  }

  function blur() {
    if (hasFocus.value)
      deactivate()
  }

  return { focus, blur }
}
