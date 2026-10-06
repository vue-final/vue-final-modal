import type { TransitionProps } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentProps, VfmTransition } from '~/types'

export type Phase = 'closed' | 'opening' | 'open' | 'closing'
type Layer = 'content' | 'overlay'

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

  /** Layers whose transition runs for the current phase: it settles once the last of them has ended. */
  const running = new Set<Layer>()
  let advanceId = 0

  function layerListeners(layer: Layer) {
    return {
      beforeEnter() {
        if (phase.value === 'opening')
          running.add(layer)
      },
      afterEnter() {
        if (phase.value === 'opening')
          ended(layer)
      },
      beforeLeave() {
        if (phase.value === 'closing')
          running.add(layer)
      },
      afterLeave() {
        if (phase.value === 'closing')
          ended(layer)
      },
    }
  }

  const contentListeners = layerListeners('content')
  const overlayListeners = layerListeners('overlay')

  function ended(layer: Layer) {
    running.delete(layer)
    if (running.size === 0)
      settle()
  }

  function settle() {
    phase.value = phase.value === 'opening' ? 'open' : 'closed'
  }

  async function advance(next: 'opening' | 'closing') {
    phase.value = next
    running.clear()
    const id = ++advanceId
    contentVisible.value = next === 'opening'
    await nextTick()
    /** The patch starts a transition synchronously, so none by now means none will run: no transition name, appear false on the first render, a stubbed Transition or a server render. */
    if (id === advanceId && running.size === 0)
      settle()
  }

  watch(phase, (value) => {
    if (value === 'opening') {
      const id = advanceId
      /** Runs once the patch is done, and not at all when a close() already superseded this open. */
      nextTick(() => {
        if (id === advanceId)
          onOpening?.()
      })
    }
    else if (value === 'open') {
      onOpen?.()
    }
    else if (value === 'closed') {
      onClosed?.()
    }
  })

  return {
    phase,
    visible,
    contentVisible,
    contentListeners,
    contentTransition,
    overlayVisible,
    overlayShown,
    overlayListeners,
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
