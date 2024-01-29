import { ModalsContainer } from './components/ModalsContainer'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'

import type { Vfm } from './Modal'

/** Types */
export * from './Modal'
export * from './Component'

/** Plugin */
export { createVfm } from './plugin'

/** Components */
export {
  ModalsContainer,
  VueFinalModal,
}

export { vueFinalModalProps } from './components/VueFinalModal/VueFinalModalProps'

export type { VueFinalModalEmits } from './components/VueFinalModal/VueFinalModal.vue'

/** Composables */
export { useC2v, c2v } from './useC2v'
export { useVfm } from './useVfm'
export { useModal } from './useModal'
export { useVfmAttrs } from './useVfmAttrs'

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
