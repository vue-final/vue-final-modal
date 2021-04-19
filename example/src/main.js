import Vue from 'vue'
import App from './App.vue'
import 'virtual:windi.css'

import VDynamicModal from './components/basic/VDynamicModal.vue'
import VModal from './components/hoc/VModal.vue'
import VTitle from './components/VTitle.vue'
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal())
Vue.component('VDynamicModal', VDynamicModal)
Vue.component('VModal', VModal)
Vue.component('VTitle', VTitle)

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
