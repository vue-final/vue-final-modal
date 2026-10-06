import type { TransitionProps } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps, VfmTransition } from '~/types'

export type Phase = 'closed' | 'opening' | 'open' | 'closing'

export function useTransition(
  props: ComponentProps<typeof VueFinalModal>,
  options: {
    onOpening?: () => void
    onOpen?: () => void
    onClosed?: () => void
  },
) {
  const { onOpening, onOpen, onClosed } = options

  const phase = ref<Phase>('closed')
  const visible = computed(() => phase.value !== 'closed')
  const contentVisible = ref(false)
  /** Toggled by overlayBehavior from the outside, so the overlay also follows the content. */
  const overlayVisible = ref(true)
  const overlayShown = computed(() => contentVisible.value && overlayVisible.value)

  const contentTransition = computed(() => mergeTransition(props.contentTransition))
  const overlayTransition = computed(() => mergeTransition(props.overlayTransition))

  let transitionStarted = false
  let advanceId = 0

  const contentListeners = {
    beforeEnter() {
      if (phase.value === 'opening')
        transitionStarted = true
    },
    afterEnter() {
      if (phase.value === 'opening')
        settle()
    },
    beforeLeave() {
      if (phase.value === 'closing')
        transitionStarted = true
    },
    afterLeave() {
      if (phase.value === 'closing')
        settle()
    },
  }

  function settle() {
    phase.value = phase.value === 'opening' ? 'open' : 'closed'
  }

  async function advance(next: 'opening' | 'closing') {
    phase.value = next
    transitionStarted = false
    const id = ++advanceId
    contentVisible.value = next === 'opening'
    await nextTick()
    /** The patch starts a transition synchronously, so none by now means none will run: no transition name, appear false on the first render, a stubbed Transition or a server render. */
    if (id === advanceId && !transitionStarted)
      settle()
  }

  watch(phase, (value) => {
    if (value === 'opening')
      onOpening?.()
    else if (value === 'open')
      onOpen?.()
    else if (value === 'closed')
      onClosed?.()
  })

  return {
    phase,
    visible,
    contentVisible,
    contentListeners,
    contentTransition,
    overlayVisible,
    overlayShown,
    overlayTransition,
    enter: () => advance('opening'),
    leave: () => advance('closing'),
  }
}

function mergeTransition(transition?: VfmTransition | TransitionProps): TransitionProps {
  if (typeof transition === 'string')
    return { name: transition, appear: true }
  return { appear: true, ...transition }
}
