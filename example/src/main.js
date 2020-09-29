import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import './assets/css/button.css'
import components from '@/components/index.js'

import { VueFinalModal } from 'vue-final-modal'

const app = createApp(App)

app.component('VueFinalModal', VueFinalModal)

Object.keys(components).forEach(name => {
  app.component(name, components[name])
})

app.mount('#app')
