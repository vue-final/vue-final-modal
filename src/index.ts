import VueFinalModal from './components/VueFinalModal.vue'
import ModalsContainer from './components/ModalsContainer.vue'
import { dynamicModals, get, hide, hideAll, modals, openedModals, show, toggle } from './api'

export * from './Modal'
export { useModal } from './useModal'

const vfm = {
  dynamicModals,
  get,
  hide,
  hideAll,
  modals,
  openedModals,
  show,
  toggle,
}

export { vfm, VueFinalModal, ModalsContainer }

