import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import '@viteplay/vue/dist/style.css'

const app = createApp(App)

app.use(router).mount('#app')
