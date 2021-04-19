import Vue from 'vue'

import VueFinalModal from '../../lib'

Vue.use(VueFinalModal())

import components from '../components/examples'
Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})
