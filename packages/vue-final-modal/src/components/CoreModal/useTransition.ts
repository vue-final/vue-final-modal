import type { ComputedRef, Ref, TransitionProps } from 'vue'
import { computed, nextTick, ref, watch } from 'vue'
import type CoreModal from './CoreModal.vue'

export enum TransitionState {
  Enter,
  Leave,
}

type TransitionListeners = {
  afterEnter: () => void
  afterLeave: () => void
}

function useTransitionState(_visible = false): [Ref<boolean>, Ref<undefined | TransitionState>, TransitionListeners ] {
  const visible = ref(_visible)
  const state = ref<undefined | TransitionState>(visible.value ? TransitionState.Enter : undefined)

  const listeners: TransitionListeners = {
    afterEnter() { state.value = TransitionState.Enter },
    afterLeave() { state.value = TransitionState.Leave },
  }

  return [visible, state, listeners]
}

export function useTransition(
  props: InstanceType<typeof CoreModal>['$props'],
  options: {
    modelValueLocal: Ref<boolean>
    onEnter?: () => void
    onLeave?: () => void
  },
): {
    visible: Ref<boolean>
    contentVisible: Ref<boolean>
    contentListeners: TransitionListeners
    contentTransition: ComputedRef<TransitionProps>
    overlayVisible: Ref<boolean>
    overlayListeners: TransitionListeners
    overlayTransition: ComputedRef<TransitionProps>
    enterTransition: () => void
    leaveTransition: () => void
  } {
  const { modelValueLocal, onEnter, onLeave } = options
  const visible = ref(modelValueLocal.value)

  const [contentVisible, contentState, contentListeners] = useTransitionState(visible.value)
  const [overlayVisible, overlayState, overlayListeners] = useTransitionState(visible.value)

  const contentTransition = computed<TransitionProps>(() => {
    if (typeof props.contentTransition === 'string')
      return { name: props.contentTransition }
    return { ...props.contentTransition }
  })

  const overlayTransition = computed<TransitionProps>(() => {
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
      case TransitionState.Enter:
        return onEnter?.()
      case TransitionState.Leave:
        return onLeave?.()
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
