import modal from './VueFinalModal.vue'

export const VueFinalModal = modal

export default {
  install(Vue) {
    Vue.component('VueFinalModal', VueFinalModal)
  },
  VueFinalModal
}
