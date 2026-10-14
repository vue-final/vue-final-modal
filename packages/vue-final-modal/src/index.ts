import type { Vfm } from './types'
import { ModalsContainer } from './components/ModalsContainer'

import VueFinalDialog from './components/VueFinalDialog.vue'
import VueFinalModal from './components/VueFinalModal.vue'

export { useModal, useModalSlot } from './composables/useModal'
export { useModalContext } from './composables/useModalContext'
export type { ModalContext } from './composables/useModalContext'
export { useModalLifecycle } from './composables/useModalLifecycle'
export type { ModalLifecycle, ModalLifecycleHooks } from './composables/useModalLifecycle'

/** Composables */
export { useVfm } from './composables/useVfm'

/** Components */
export {
  ModalsContainer,
  VueFinalDialog,
  VueFinalModal,
}

export { useVfmAttrs } from './composables/useVfmAttrs'
/** Advanced */
export { createModalsProvider } from './createModalsProvider'
/** Plugin */
export { createVfm } from './plugin'

/** Types */
export * from './types'

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
