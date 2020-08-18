import modal from './VueFinalModal.vue'

const VueFinalModal = modal

const install = function(Vue) {
  Vue.component('VueFinalModal', VueFinalModal)
}

export default {
  install,
  VueFinalModal
}
