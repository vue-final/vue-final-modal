import VueFinalModal from './components/VueFinalModal.vue'
import ModalsContainer from './components/ModalsContainer.vue'
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

export { vfm, VueFinalModal, ModalsContainer }

