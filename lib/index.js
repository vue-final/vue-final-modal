import modal from './VueFinalModal.vue'

export const VueFinalModal = modal

export const install = function(Vue) {
  Vue.component('VueFinalModal', VueFinalModal)
}
