import { useModal } from 'vue-final-modal'
import PlainCssConfirmModal from './PlainCssConfirmModal.vue'

export function showConfirmModal() {
  const { open, close } = useModal({
    component: PlainCssConfirmModal,
    attrs: {
      title: 'Hello World!',
      onConfirm() {
        close()
      },
    },
    slots: {
      default: '<p>The content of the modal</p>',
    },
  })

  open()
}
