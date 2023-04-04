import { VueFinalModal, useModal, useModalSlot } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

console.log('helper')
export const modal = useModal({
  component: VueFinalModal,
  // defaultModelValue: true,
  slots: {
    default: useModalSlot({
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
