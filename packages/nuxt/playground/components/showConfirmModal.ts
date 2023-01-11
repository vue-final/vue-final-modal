import type { Vfm } from 'vue-final-modal'
import { useModal } from 'vue-final-modal'
import PlainCssConfirmModal from './PlainCssConfirmModal.vue'

export function showConfirmModal(vfm: Vfm) {
  const { open, close, destroy } = useModal({
    context: vfm,
    component: PlainCssConfirmModal,
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
