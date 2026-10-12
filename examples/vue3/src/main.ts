import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import App from './App.vue'
import 'vue-final-modal/style.css'
import './style.css'

createApp(App).use(createVfm()).mount('#app')
