import Vue from 'vue'

import VueFinalModal from 'vue-final-modal/lib/VueFinalModal.vue'
// import VueFinalModal from '../../lib/VueFinalModal.vue'

Vue.component('VueFinalModal', VueFinalModal)

import { FocusTrap } from 'focus-trap-vue'

Vue.component('FocusTrap', FocusTrap)

import components from '../../example/src/components/index.js'
Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})
