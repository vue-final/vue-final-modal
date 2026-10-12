import { createApp } from 'vue'
import './style.css'
// eslint-disable-next-line perfectionist/sort-imports -- global styles must load before component styles
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
