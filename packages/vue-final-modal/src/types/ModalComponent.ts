import type { PropType } from 'vue'

/** The props `useModal()` passes to its `component`. */
export const modalComponentProps = {
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
}

type ModalComponentEvent = 'update:modelValue' | 'beforeOpen' | 'opened' | 'beforeClose' | 'closed' | '_opened' | '_closed' | '_stopped'

/** The events of {@link ModalComponentEmits}, for `emits` in the Options API. */
export const modalComponentEmits: ModalComponentEvent[] = ['update:modelValue', 'beforeOpen', 'opened', 'beforeClose', 'closed', '_opened', '_closed', '_stopped']

/**
 * The events `useModalLifecycle()` emits, which `useModal()` listens to on its `component` to settle `open()` and `close()`.
 * Declare them on a component that shows the modal itself, not on a wrapper around `<VueFinalModal>` or `<VueFinalDialog>`:
 * a wrapper that declares the internal ones swallows the listeners `useModal()` adds for them.
 */
export interface ModalComponentEmits {
  (e: 'update:modelValue', modelValue: boolean): void

  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void

  (e: '_opened'): void
  (e: '_closed'): void
  /** beforeOpen or beforeClose stopped the open or the close */
  (e: '_stopped', opening: boolean): void
}
