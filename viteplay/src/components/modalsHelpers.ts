import { VueFinalModal, defineTemplate, useModal } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'

console.log('helper')

export const modal = useModal({
  component: VueFinalModal,
  slots: {
    default: defineTemplate({
      component: DefaultSlot,
      attrs: {
        text: '123',
        onClose: () => { modal.close() },
      },
    }),
  },
})
// modal.open()
