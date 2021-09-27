import { markRaw } from 'vue'
import { useModal } from 'vue-final-modal'
import VToast from '@/components/use-cases/VToast.vue'

export const $toast = {
  show(props) {
    const { show } = useModal({
      component: markRaw(VToast),
      bind: {
        ...props
      }
    })
    return show()
  }
}
