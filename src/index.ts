import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import ModalsContainer from './components/ModalsContainer.vue'
import VBottomSheet from './components/VBottomSheet/VBottomSheet.vue'
import VFullScreen from './components/VFullScreen/VFullScreen.vue'
import { close, closeAll, dynamicModals, get, modals, open, openedModals, toggle } from './api'

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
  VueFinalModal,
  ModalsContainer,
  VBottomSheet,
  VFullScreen,
}

