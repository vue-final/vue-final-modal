import type { WritableComputedRef } from 'vue'
import type { ModalComponentEmits } from '~/types'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ALREADY_CLOSED, ALREADY_OPENED, CLOSE_STOPPED, DESTROYED, noop, OPEN_STOPPED, TOGGLED_AGAIN } from '~/utils'

export interface ModalLifecycleHooks {
  /** Shows the modal. A returned promise holds `opened` back until it settles, for example until an enter transition ends. */
  open: () => unknown
  /** Hides the modal. A returned promise holds `closed` back until it settles. */
  close: () => unknown
}

export interface ModalLifecycle {
  /** Set it to open or close the modal from inside, after `beforeOpen` or `beforeClose` let it: `modelValue` is written back. */
  isOpen: WritableComputedRef<boolean>
  /** Reports a modal that already closed by itself, so `beforeClose` is not asked. */
  reportClosed: () => void
  /** Resolves once the modal has opened or closed, like `useVfm().toggle()`. */
  toggle: (show?: boolean) => Promise<string>
}

/**
 * Wires a modal component to `modelValue` and to the events `useModal()` settles `open()` and `close()` on.
 */
export function useModalLifecycle(props: { modelValue?: boolean }, emit: ModalComponentEmits, hooks: ModalLifecycleHooks): ModalLifecycle {
  const state = ref(false)
  let mounted = false
  /** Bumped by every open and close, so one toggled again before it finished does not report. */
  let run = 0
  let resolvePendingToggle: (result: string) => void = noop

  /** Only changes when beforeOpen or beforeClose let it: a stopped one bounces the previous value back to v-model. */
  const isOpen = computed<boolean>({
    get: () => state.value,
    set(next) {
      if (next === state.value)
        return
      let stopped = false
      if (next)
        emit('beforeOpen', { stop: () => stopped = true })
      else
        emit('beforeClose', { stop: () => stopped = true })
      if (stopped) {
        emit('update:modelValue', !next)
        emit('_stopped', next)
        resolveToggle(next ? OPEN_STOPPED : CLOSE_STOPPED)
        return
      }
      change(next)
    },
  })

  function change(next: boolean) {
    state.value = next
    if (next !== props.modelValue)
      emit('update:modelValue', next)
    if (mounted)
      transition(next)
  }

  function reportClosed() {
    if (state.value)
      change(false)
  }

  if (props.modelValue)
    isOpen.value = true

  watch(() => props.modelValue, (next) => {
    isOpen.value = !!next
  })

  onMounted(() => {
    mounted = true
    if (state.value)
      transition(true)
  })

  onBeforeUnmount(() => {
    mounted = false
    run++
    resolveToggle(DESTROYED)
  })

  async function transition(opening: boolean) {
    const current = ++run
    /** The hooks see the DOM rendered for the new state. */
    await nextTick()
    if (current !== run)
      return
    await (opening ? hooks.open() : hooks.close())
    if (current !== run)
      return
    if (opening) {
      emit('opened')
      emit('_opened')
    }
    else {
      emit('closed')
      emit('_closed')
    }
    resolveToggle(opening ? 'opened' : 'closed')
  }

  function resolveToggle(result: string) {
    resolvePendingToggle(result)
    resolvePendingToggle = noop
  }

  function toggle(show = !state.value): Promise<string> {
    if (state.value === show)
      return Promise.resolve(show ? ALREADY_OPENED : ALREADY_CLOSED)
    resolveToggle(TOGGLED_AGAIN)
    return new Promise((resolve) => {
      resolvePendingToggle = resolve
      isOpen.value = show
    })
  }

  return { isOpen, reportClosed, toggle }
}
