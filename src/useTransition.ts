import type { BaseTransitionProps, ComputedRef, Ref } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import type VueFinalModal from './components/VueFinalModal.vue'

export enum TransitionState {
  Enter,
  Entering,
  Leave,
  Leaving,
}

interface TransitionListeners {
  beforeEnter: () => void
  afterEnter: () => void
  beforeLeave: () => void
  afterLeave: () => void
}

type BindTransition = { name: 'vfm' | string } | BaseTransitionProps

function useTransitionState(): [Ref<boolean>, Ref<undefined | TransitionState>, TransitionListeners ] {
  const visible = ref(false)
  const state = ref<TransitionState>()

  const listeners: TransitionListeners = {
    beforeEnter() { state.value = TransitionState.Entering },
    afterEnter() { state.value = TransitionState.Enter },
    beforeLeave() { state.value = TransitionState.Leaving },
    afterLeave() { state.value = TransitionState.Leave },
  }

  return [visible, state, listeners]
}

export function useTransition(props: InstanceType<typeof VueFinalModal>['$props'], options: {
  onEntering: () => void
  onEnter: () => void
  onLeaving: () => void
  onLeave: () => void
}): {
    visible: Ref<boolean>
    containerVisible: Ref<boolean>
    containerListeners: TransitionListeners
    containerTransition: ComputedRef<BindTransition>
    overlayVisible: Ref<boolean>
    overlayListeners: TransitionListeners
    overlayTransition: ComputedRef<BindTransition>
    enterTransition: () => void
    leaveTransition: () => void
  } {
  const { onEntering, onEnter, onLeaving, onLeave } = options
  const visible = ref<boolean>(false)

  const [containerVisible, containerState, containerListeners] = useTransitionState()
  const [overlayVisible, overlayState, overlayListeners] = useTransitionState()

  const containerTransition = computed<BindTransition>(() => {
    if (typeof props.transition === 'string')
      return { name: props.transition }
    return { ...props.transition }
  })

  const overlayTransition = computed<BindTransition>(() => {
    if (typeof props.overlayTransition === 'string')
      return { name: props.overlayTransition }
    return { ...props.overlayTransition }
  })

  const isReadyToBeDestroyed = computed(() =>
    (props.hideOverlay || overlayState.value === TransitionState.Leave)
        && containerState.value === TransitionState.Leave)

  watch(
    isReadyToBeDestroyed,
    (value) => {
      if (value)
        visible.value = false
    },
  )

  watch(containerState, (state) => {
    switch (state) {
      case TransitionState.Entering:
        return onEntering()
      case TransitionState.Enter:
        return onEnter()
      case TransitionState.Leaving:
        return onLeaving()
      case TransitionState.Leave:
        return onLeave()
    }
  })

  async function enterTransition() {
    visible.value = true
    await nextTick()
    containerVisible.value = true
    overlayVisible.value = true
  }

  function leaveTransition() {
    containerVisible.value = false
    overlayVisible.value = false
  }

  return {
    visible,

    containerVisible,
    containerListeners,
    containerTransition,

    overlayVisible,
    overlayListeners,
    overlayTransition,

    enterTransition,
    leaveTransition,
  }
}
