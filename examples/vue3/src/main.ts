import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'
import './style.css'
import App from './App.vue'

createApp(App).use(createVfm()).mount('#app')
