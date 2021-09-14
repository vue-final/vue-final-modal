import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'

import { VueFinalModal, ModalsContainer } from 'vue-final-modal'

import VDynamicModal from './components/basic/VDynamicModal.vue'
import CustomModal from './components/hoc/CustomModal.vue'
import VTitle from './components/VTitle.vue'
import VDescription from './components/VDescription.vue'

const app = createApp(App)

app.component('VueFinalModal', VueFinalModal)
app.component('ModalsContainer', ModalsContainer)

app.component('VDynamicModal', VDynamicModal)
app.component('CustomModal', CustomModal)
app.component('VTitle', VTitle)
app.component('VDescription', VDescription)

app.mount('#app')
