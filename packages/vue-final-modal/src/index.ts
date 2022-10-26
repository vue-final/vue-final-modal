import ModalsContainer from './components/ModalsContainer.vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import VFullScreen from './components/VFullScreen/VFullScreen.vue'
import VBottomSheet from './components/VBottomSheet/VBottomSheet.vue'

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

/** Composables */
export * from './useApi'

/** Utils */
export * from './components/CoreModal/modalEvents'
export { pickModalProps } from './utils'

/** Types */
export * from './Modal'

export * from './plugin'
