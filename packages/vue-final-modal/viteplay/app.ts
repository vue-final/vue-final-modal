import '@viteplay/vue/dist/style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'

const app = createApp(App)

app.use(router).mount('#app')
