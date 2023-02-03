import type { Vfm } from 'vue-final-modal'
import { useModal } from 'vue-final-modal'
import ModalConfirmPlainCss from './ModalConfirmPlainCss.vue'

export function showModalConfirm(vfm: Vfm) {
  const { open, close, destroy } = useModal({
    context: vfm,
    component: ModalConfirmPlainCss,
    attrs: {
      title: 'Hello World!',
      onConfirm() {
        close()
      },
      onClosed() {
        destroy()
      },
    },
    slots: {
      default: '<p>The content of the modal</p>',
    },
  })

  open()
}
