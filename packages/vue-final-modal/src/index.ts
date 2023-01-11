import ModalsContainer from './components/ModalsContainer.vue'
import CoreModal from './components/CoreModal/CoreModal.vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import ModalFullscreen from './components/ModalFullscreen/ModalFullscreen.vue'
import ModalBottom from './components/ModalBottom/ModalBottom.vue'

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
  ModalBottom,
  ModalFullscreen,
}

export { coreModalProps } from './components/CoreModal/CoreModalProps'
export { vueFinalModalProps } from './components/VueFinalModal/VueFinalModalProps'
export { modalFullscreenProps } from './components/ModalFullscreen/ModalFullscreenProps'
export { modalBottomProps } from './components/ModalBottom/ModalBottomProps'

export type { VueFinalModalEmits } from './components/VueFinalModal/VueFinalModal.vue'
export type { ModalFullscreenEmits } from './components/ModalFullscreen/ModalFullscreen.vue'
export type { ModalBottomEmits } from './components/ModalBottom/ModalBottom.vue'

/** Composables */
export { useVfm, useModal, useVfmAttrs } from './useApi'

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
