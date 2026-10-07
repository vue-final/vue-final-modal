import type { Ref } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import { lockScroll, unlockScroll } from '@hunterliu/scroll-lock'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps } from '~/types'

export function useLockScroll(props: ComponentProps<typeof VueFinalModal>, options: {
  rootEl: Ref<HTMLElement | undefined>
  modelValueLocal: Ref<boolean>
}) {
  const { rootEl, modelValueLocal } = options
  /** Locks are reference counted: a modal releases exactly the ones it took, whichever of close and unmount comes first. */
  let held: HTMLElement[] = []

  watch(() => props.lockScroll, lock => lock ? disable() : enable())
  onBeforeUnmount(enable)

  function disable() {
    if (held.length || !props.lockScroll || !modelValueLocal.value)
      return
    held = [document.body, ...scrollContainers(rootEl.value)]
    held.forEach(el => lockScroll(el, { reserveScrollBarGap: props.reserveScrollBarGap }))
  }

  function enable() {
    held.forEach(el => unlockScroll(el))
    held = []
  }

  return {
    enableScroll: enable,
    disableScroll: disable,
  }
}

/** A modal that is not teleported to the body can sit in a scroll container, which would scroll behind it too. */
function scrollContainers(el: HTMLElement | undefined) {
  const containers: HTMLElement[] = []
  for (let parent = el?.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
    const { overflowX, overflowY } = getComputedStyle(parent)
    if ([overflowX, overflowY].some(overflow => overflow === 'auto' || overflow === 'scroll'))
      containers.push(parent)
  }
  return containers
}
