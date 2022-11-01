import Vue from 'vue'

import VueFinalModal from 'vue-final-modal/lib'

Vue.use(VueFinalModal())

import components from '../components/examples'
Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})
