import ModalsContainer from './components/ModalsContainer.vue'
import CoreModal from './components/CoreModal/CoreModal.vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'

import type { Vfm } from './Modal'

/** Types */
export * from './Modal'

/** Plugin */
export * from './plugin'

/** Components */
export {
  ModalsContainer,
  CoreModal,
  VueFinalModal,
}

export { coreModalProps } from './components/CoreModal/CoreModalProps'
export { vueFinalModalProps } from './components/VueFinalModal/VueFinalModalProps'

export type { VueFinalModalEmits } from './components/VueFinalModal/VueFinalModal.vue'

/** Composables */
export { useVfm, useModal, useVfmAttrs, useModalSlot } from './useApi'

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
