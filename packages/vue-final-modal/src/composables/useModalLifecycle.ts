import type { Ref, WritableComputedRef } from 'vue'
import type { ModalCloseResult, ModalComponentEmits, ModalOpenResult, ModalStatus, ModalToggle } from '~/types'
import type { Pending } from '~/utils'
import { computed, nextTick, onBeforeUnmount, onMounted, readonly, ref, watch } from 'vue'
import { createPending, noop } from '~/utils'

export interface ModalLifecycleHooks {
  /** Shows the modal. A returned promise holds `opened` back until it settles, for example until an enter transition ends. */
  open: () => unknown
  /** Hides the modal. A returned promise holds `closed` back until it settles. */
  close: () => unknown
}

/** Like {@link ModalLifecycleHooks}, but a hook calls `done` itself, so `opened` and `closed` are emitted right then. */
interface ModalTransitions {
  open: (done: () => void) => void
  close: (done: () => void) => void
}

export interface ModalLifecycle {
  /** Set it to open or close the modal from inside, after `beforeOpen` or `beforeClose` let it: `modelValue` is written back. */
  isOpen: WritableComputedRef<boolean>
  /** Reports a modal that already closed by itself, so `beforeClose` is not asked. */
  reportClosed: () => void
  /** Resolves once the modal has opened or closed, like `useVfm().toggle()`. Called while the modal is heading there, it settles with that change. */
  toggle: ModalToggle
  status: Readonly<Ref<ModalStatus>>
}

/**
 * Wires a modal component to `modelValue` and to the events `useModal()` settles `open()` and `close()` on.
 * The hooks run once the component has mounted and rendered the new state.
 */
export function useModalLifecycle(props: { modelValue?: boolean }, emit: ModalComponentEmits, hooks: ModalLifecycleHooks): ModalLifecycle {
  let resolveMounted: () => void = noop
  const mounted = new Promise<void>(resolve => resolveMounted = resolve)
  onMounted(() => resolveMounted())

  /** Only the last open or close asked for before the render runs its hook, and none once unmounted. */
  let latest = 0
  onBeforeUnmount(() => latest++)
  function afterRender(hook: () => unknown) {
    return async (done: () => void) => {
      const id = ++latest
      await mounted
      await nextTick()
      if (id !== latest)
        return
      await hook()
      done()
    }
  }

  const lifecycle = createModalLifecycle(props, emit, { open: afterRender(hooks.open), close: afterRender(hooks.close) })
  if (props.modelValue)
    lifecycle.isOpen.value = true
  return lifecycle
}

/**
 * The lifecycle `<VueFinalModal>` shares with `useModalLifecycle()`: its hooks start right away, in setup and on the server too,
 * so a modal opened in setup is part of the server HTML. Nothing opens on its own: the component opens it once its hooks are ready.
 */
export function createModalLifecycle(props: { modelValue?: boolean }, emit: ModalComponentEmits, transitions: ModalTransitions): ModalLifecycle {
  const state = ref(false)
  const status = ref<ModalStatus>('closed')
  /** Bumped by every open and close, so one toggled again before it finished does not report. */
  let run = 0
  let pending: (Pending<ModalOpenResult | ModalCloseResult> & { show: boolean }) | undefined
  /** An open or close asked for while the component unmounts would run its hooks on a component that is gone. */
  let unmounted = false

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
        resolveToggle('stopped')
        return
      }
      change(next)
    },
  })

  function change(next: boolean) {
    if (pending && pending.show !== next)
      resolveToggle('toggled-again')
    state.value = next
    setStatus(next ? 'opening' : 'closing')
    if (!unmounted)
      transition(next)
    if (next !== props.modelValue)
      emit('update:modelValue', next)
  }

  function reportClosed() {
    if (state.value)
      change(false)
  }

  watch(() => props.modelValue, (next) => {
    isOpen.value = !!next
  })

  onBeforeUnmount(() => {
    unmounted = true
    run++
    setStatus('closed')
    resolveToggle('destroyed')
  })

  function transition(opening: boolean) {
    const current = ++run
    function done() {
      if (current !== run)
        return
      setStatus(opening ? 'opened' : 'closed')
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
    if (opening)
      transitions.open(done)
    else
      transitions.close(done)
  }

  function setStatus(next: ModalStatus) {
    if (next === status.value)
      return
    status.value = next
    emit('_status', next)
  }

  function resolveToggle(result: ModalOpenResult | ModalCloseResult) {
    const settled = pending
    pending = undefined
    settled?.resolve(result)
  }

  /** The promise of the change heading to `show`, shared by every toggle that asks for it. */
  function heading(show: boolean) {
    pending ??= { show, ...createPending<ModalOpenResult | ModalCloseResult>() }
    return pending.promise
  }

  function toggle(show = !state.value) {
    if (state.value === show) {
      if (status.value === (show ? 'opening' : 'closing'))
        return heading(show)
      return Promise.resolve(show ? 'already-opened' : 'already-closed')
    }
    resolveToggle('toggled-again')
    const promise = heading(show)
    isOpen.value = show
    return promise
  }

  return { isOpen, reportClosed, toggle: toggle as ModalToggle, status: readonly(status) }
}
