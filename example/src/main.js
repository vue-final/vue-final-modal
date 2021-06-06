import Vue from 'vue'
import App from './App.vue'
import 'virtual:windi.css'

import VDynamicModal from './components/basic/VDynamicModal.vue'
import CustomModal from './components/hoc/CustomModal.vue'
import VTitle from './components/VTitle.vue'

import { vfmPlugin } from 'vue-final-modal'
Vue.use(vfmPlugin)

Vue.component('VDynamicModal', VDynamicModal)
Vue.component('CustomModal', CustomModal)
Vue.component('VTitle', VTitle)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
