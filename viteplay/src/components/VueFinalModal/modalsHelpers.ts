import { VueFinalModal, h, useModal } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

console.log('helper')
export const modal = useModal({
  component: VueFinalModal,
  // defaultModelValue: true,
  slots: {
    default: h({
      component: DefaultSlot,
      attrs: {
        text: '123',
        onCreate() {
          // console.log('onCreated')
        },
      },
    }),
  },
})
// modal.open()
