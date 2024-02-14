import { ModalsContainer } from './components/ModalsContainer'
import VueFinalModal from './components/VueFinalModal.vue'

import type { Vfm } from './types'

/** Types */
export * from './types'

/** Plugin */
export { createVfm } from './plugin'

/** Components */
export {
  ModalsContainer,
  VueFinalModal,
}

export type { VueFinalModalEmits } from './components/VueFinalModal.vue'

export * from 'vue-use-template'

/** Composables */
export { useVfm } from './composables/useVfm'
export { useTemplate } from './composables/useTemplate'
export { useModal } from './composables/useModal'
export { useVfmAttrs } from './composables/useVfmAttrs'

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    /**
     * Vue Final Modal global state for the modal components and also provides
     * functions that can be used to control the modal components. {@link Vfm}
     */
    $vfm: Vfm
  }
}

export { }
