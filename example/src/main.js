import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'

import VDynamicModal from './components/basic/VDynamicModal.vue'
import CustomModal from './components/hoc/CustomModal.vue'
import VTitle from './components/VTitle.vue'
import VueFinalModal from 'vue-final-modal'

const app = createApp(App)

app.use(VueFinalModal())
app.component('VDynamicModal', VDynamicModal)
app.component('CustomModal', CustomModal)
app.component('VTitle', VTitle)

app.mount('#app')
