import ModalsContainer from './components/ModalsContainer.vue'
import CoreModal from './components/CoreModal/CoreModal.vue'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import VBottomSheet from './components/VBottomSheet/VBottomSheet.vue'
import VFullScreen from './components/VFullScreen/VFullScreen.vue'
import { close, closeAll, dynamicModals, get, modals, open, openedModals, toggle } from './api'

export { byPassAllModalEvents } from './components/CoreModal/modalEvents'
export { pickModalProps } from './utils'

export { coreModalProps } from './components/CoreModal/CoreModalProps'
export { vueFinalModalProps } from './components/VueFinalModal/VueFinalModalProps'
export { vFullScreenProps } from './components/VFullScreen/VFullScreenProps'
export { vBottomSheetProps } from './components/VBottomSheet/VBottomSheetProps'

export * from './Modal'

export { useModal } from './useModal'

const vfm = {
  close,
  closeAll,
  dynamicModals,
  get,
  modals,
  open,
  openedModals,
  toggle,
}

export {
  vfm,
  ModalsContainer,
  CoreModal,
  VueFinalModal,
  VBottomSheet,
  VFullScreen,
}
