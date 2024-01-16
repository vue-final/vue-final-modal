import { VueFinalModal, useModal, c2v } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

console.log('helper')
export const modal = useModal({
  component: VueFinalModal,
  // defaultModelValue: true,
  slots: {
    default: c2v({
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
