import modal from './VueFinalModal'

export const VueFinalModal = modal

export default {
  install(Vue) {
    Vue.component('VueFinalModal', VueFinalModal)
  },
  VueFinalModal
}
