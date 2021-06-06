import Vue from 'vue'

import { vfmPlugin } from '../../lib'

Vue.use(vfmPlugin)

import components from '../components/examples'
Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})
