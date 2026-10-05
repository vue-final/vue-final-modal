import { useModal } from 'vue-final-modal'
import PlainCssConfirmModal from './PlainCssConfirmModal.vue'

export function showConfirmModal() {
  const { show, hide } = useModal({
    component: PlainCssConfirmModal,
    attrs: {
      title: 'Hello World!',
      onConfirm() {
        hide()
      },
    },
    slots: {
      default: '<p>The content of the modal</p>',
    },
  })

  show()
}
