import { createApp } from 'vue'
import App from './App.vue'
import './assets/css/tailwind.css'
import { VueFinalModal } from 'vue-final-modal'

const app = createApp(App)

app.component('VueFinalModal', VueFinalModal)

app.mount('#app')
