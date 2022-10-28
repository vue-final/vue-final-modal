import ModalsContainer from './components/ModalsContainer.vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import VFullScreen from './components/VFullScreen/VFullScreen.vue'
import VBottomSheet from './components/VBottomSheet/VBottomSheet.vue'

/** Types */
export * from './Modal'

/** Plugin */
export * from './plugin'

/** Components */
export {
  ModalsContainer,
  VueFinalModal,
  VBottomSheet,
  VFullScreen,
}

export { vueFinalModalProps } from './components/VueFinalModal/VueFinalModalProps'
export { vFullScreenProps } from './components/VFullScreen/VFullScreenProps'
export { vBottomSheetProps } from './components/VBottomSheet/VBottomSheetProps'

export type { VueFinalModalEmits } from './components/VueFinalModal/VueFinalModal.vue'
export type { VFullScreenEmits } from './components/VFullScreen/VFullScreen.vue'
export type { VBottomSheetEmits } from './components/VBottomSheet/VBottomSheet.vue'

/** Composables */
export { useVfm, useModal } from './useApi'

/** Utils */
export { byPassAllModalEvents, pickModalProps } from './utils'
