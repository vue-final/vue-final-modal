import { ref } from 'vue'

export const TransitionState = {
  Enter: 'enter',
  Entering: 'entering',
  Leave: 'leave',
  Leaving: 'leavng'
}

export const useTransitionState = () => {
  const state = ref(null)

  const listeners = {
    beforeEnter() {
      state.value = TransitionState.Entering
    },
    afterEnter() {
      state.value = TransitionState.Enter
    },
    beforeLeave() {
      state.value = TransitionState.Leaving
    },
    afterLeave() {
      state.value = TransitionState.Leave
    }
  }

  return {
    state,
    listeners
  }
}
