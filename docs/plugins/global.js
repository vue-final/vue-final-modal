import Vue from 'vue'

// import VueFinalModal from 'vue-final-modal'
import VueFinalModal from '../../lib'

Vue.use(VueFinalModal)

import components from '../../example/src/components/index.js'
Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})
