import type { BaseTransitionProps, ComputedRef, Ref, TransitionProps } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import type VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'

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

type BindTransition = { name: 'vfm' | string } | TransitionProps | BaseTransitionProps

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
    contentVisible: Ref<boolean>
    contentListeners: TransitionListeners
    contentTransition: ComputedRef<BindTransition>
    overlayVisible: Ref<boolean>
    overlayListeners: TransitionListeners
    overlayTransition: ComputedRef<BindTransition>
    enterTransition: () => void
    leaveTransition: () => void
  } {
  const { onEntering, onEnter, onLeaving, onLeave } = options
  const visible = ref<boolean>(false)

  const [contentVisible, contentState, contentListeners] = useTransitionState()
  const [overlayVisible, overlayState, overlayListeners] = useTransitionState()

  const contentTransition = computed<BindTransition>(() => {
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
        && contentState.value === TransitionState.Leave)

  watch(
    isReadyToBeDestroyed,
    (value) => {
      if (value)
        visible.value = false
    },
  )

  watch(contentState, (state) => {
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
    contentVisible.value = true
    overlayVisible.value = true
  }

  function leaveTransition() {
    contentVisible.value = false
    overlayVisible.value = false
  }

  return {
    visible,

    contentVisible,
    contentListeners,
    contentTransition,

    overlayVisible,
    overlayListeners,
    overlayTransition,

    enterTransition,
    leaveTransition,
  }
}
