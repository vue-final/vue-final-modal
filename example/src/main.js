import Vue from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import './assets/css/button.css'
import components from '@/components/index.js'

import { VueFinalModal } from 'vue-final-modal'

Vue.component('VueFinalModal', VueFinalModal)

Object.keys(components).forEach(name => {
  Vue.component(name, components[name])
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
