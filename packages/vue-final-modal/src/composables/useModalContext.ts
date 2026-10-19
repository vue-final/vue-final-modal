import { inject } from 'vue'
import { modalContextKey } from '~/injectionSymbols'

/** What `<VueFinalModal>` and `<VueFinalDialog>` pass to their default slot and provide to everything rendered in it. */
export interface ModalContext {
  /** Closes the modal. */
  close: () => void
  /** The id to render the title with: the modal gets `aria-labelledby` once an element has it. */
  titleId: string
  /** The id to render the description with: the modal gets `aria-describedby` once an element has it. */
  descriptionId: string
}

/**
 * The context of the modal this component is rendered in, such as a component passed in the `slots` of `useModal()`,
 * which does not receive the slot props. `undefined` outside a modal.
 */
export function useModalContext(): ModalContext | undefined {
  return inject(modalContextKey, undefined)
}
