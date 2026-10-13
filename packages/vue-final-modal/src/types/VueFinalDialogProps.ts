import type { PropType } from 'vue'
import type { ModalId } from './Modal'
import { modalComponentProps } from './ModalComponent'

export const vueFinalDialogProps = {
  ...modalComponentProps,
  /**
   * @description An uniq name for the open/close a dialog via vfm.open/vfm.close APIs.
   * @default `undefined`
   */
  modalId: {
    type: [String, Number, Symbol] as PropType<ModalId>,
    default: undefined,
  },
  /**
   * @description Open the dialog with `showModal()`, or with `show()` when `false`.
   * @default `true`
   */
  modal: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * @description The native `closedby` attribute: which user actions close the dialog.
   * @default `undefined`
   */
  closedby: {
    type: String as PropType<'any' | 'closerequest' | 'none'>,
    default: undefined,
  },
  /**
   * @description Lock the scroll of the page while the dialog is open.
   * @default `false`
   */
  lockScroll: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
}
