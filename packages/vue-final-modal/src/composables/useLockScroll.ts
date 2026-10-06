import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import { lockScroll, unlockScroll } from '@hunterliu/scroll-lock'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps } from '~/types'

export function useLockScroll(props: ComponentProps<typeof VueFinalModal>, options: {
  modelValueLocal: Ref<boolean>
}) {
  const { modelValueLocal } = options
  /** The lock is reference counted: a modal releases the one lock it took, whichever of close and unmount comes first. */
  let holding = false

  watch(() => props.lockScroll, locked => locked ? disable() : enable())
  onBeforeUnmount(enable)

  function disable() {
    if (holding || !props.lockScroll || !modelValueLocal.value)
      return
    lockScroll(document.body, { reserveScrollBarGap: props.reserveScrollBarGap })
    holding = true
  }

  function enable() {
    if (!holding)
      return
    unlockScroll(document.body)
    holding = false
  }

  return {
    enableBodyScroll: enable,
    disableBodyScroll: disable,
  }
}
