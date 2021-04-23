import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import './assets/css/button.css'

import VDynamicModal from './components/basic/VDynamicModal.vue'
import VModal from './components/hoc/VModal.vue'
import VTitle from './components/VTitle.vue'
import VueFinalModal from 'vue-final-modal'

const app = createApp(App)

app.use(VueFinalModal())
app.component('VDynamicModal', VDynamicModal)
app.component('VModal', VModal)
app.component('VTitle', VTitle)

app.mount('#app')
