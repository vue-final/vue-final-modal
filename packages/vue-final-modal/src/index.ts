import ModalsContainer from './components/ModalsContainer.vue'
import CoreModal from './components/CoreModal/CoreModal.vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import VFullscreen from './components/VFullscreen/VFullscreen.vue'
import VBottomSheet from './components/VBottomSheet/VBottomSheet.vue'

/** Types */
export * from './Modal'

/** Plugin */
export * from './plugin'

/** Components */
export {
  ModalsContainer,
  CoreModal,
  VueFinalModal,
  VBottomSheet,
  VFullscreen,
}

export { coreModalProps } from './components/CoreModal/CoreModalProps'
export { vueFinalModalProps } from './components/VueFinalModal/VueFinalModalProps'
export { vFullscreenProps } from './components/VFullscreen/VFullscreenProps'
export { vBottomSheetProps } from './components/VBottomSheet/VBottomSheetProps'

export type { VueFinalModalEmits } from './components/VueFinalModal/VueFinalModal.vue'
export type { VFullscreenEmits } from './components/VFullscreen/VFullscreen.vue'
export type { VBottomSheetEmits } from './components/VBottomSheet/VBottomSheet.vue'

/** Composables */
export { useVfm, useModal, useVfmAttrs } from './useApi'
