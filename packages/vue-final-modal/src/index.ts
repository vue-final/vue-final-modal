import VueFinalModal from './components/VueFinalModal.vue'
import { ModalsContainer } from './components/ModalsContainer'

import type { Vfm } from './types'

/** Types */
export * from './types'

export type { VueFinalModalEmits } from './components/VueFinalModal.vue'

/** Plugin */
export { createVfm } from './plugin'

/** Components */
export {
  ModalsContainer,
  VueFinalModal,
}

/** Composables */
export { useVfm } from './composables/useVfm'
export { useModal, useModalSlot } from './composables/useModal'
export { useVfmAttrs } from './composables/useVfmAttrs'

/** Advanced */
export { createModalsProvider } from './createModalsProvider'

/** Helpers */
export { defineModal } from './utils'
export { defineTemplate, markServer } from 'vue-use-template'

declare module 'vue' {
  export interface ComponentCustomProperties {
    /**
     * Vue Final Modal global state for the modal components and also provides
     * functions that can be used to control the modal components. {@link Vfm}
     */
    $vfm: Vfm
  }
}

export { }
