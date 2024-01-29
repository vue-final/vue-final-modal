import type { Ref } from 'vue'
import { useFocusTrap as _useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type VueFinalModal from './VueFinalModal.vue'
import type { ComponentProps } from '~/Component'

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
