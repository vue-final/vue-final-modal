import Theme from 'vitepress/theme'
import Layout from './Layout.vue'

import 'windi-base.css'
import 'windi-components.css'
import './custom.css'
import './code-theme.css'
import 'windi-utilities.css'

/** @type {import('vitepress').Theme} */
const config = {
  ...Theme,

  Layout,

  enhanceApp({ app }) {}
}

export default config
