import Vue from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import '@/index'
import VueAnalytics from 'vue-analytics'

Vue.use(VueAnalytics, {
  id: 'UA-170494825-1'
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
