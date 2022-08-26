import Theme from 'vitepress/theme'
import Layout from './Layout.vue'

import 'windi-base.css'
import 'windi-components.css'
import './variables.css'
import './custom.css'
import './windi.css'
import './global.css'
import './code-theme.css'
import 'windi-utilities.css'

import { VueFinalModal, VFullScreen } from 'vue-final-modal'

/** @type {import('vitepress').Theme} */
const config = {
  ...Theme,

  Layout,

  enhanceApp({ app }) {
    app.component('VueFinalModal', VueFinalModal)
    app.component('VFullScreen', VFullScreen)
  }
}

export default config
