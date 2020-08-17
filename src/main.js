import Vue from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import { VueFinalModal } from 'vue-final-modal'

Vue.component('VueFinalModal', VueFinalModal)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
