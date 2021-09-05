import Theme from 'vitepress/theme'
import Layout from './Layout.vue'
import './variables.css'
import './custom.css'

import 'windi-base.css'
import 'windi-components.css'
import './custom.css'
import './code-theme.css'
import 'windi-utilities.css'

import { VueFinalModal } from '../../../lib/index'
import { CodeBlock } from '@planetar/code-block'
import CodeBlockComponent from '../components/CodeBlockComponent.vue'
import VButton from '../components/VButton.vue'

/** @type {import('vitepress').Theme} */
const config = {
  ...Theme,

  Layout,

  enhanceApp({ app }) {
    // register global components
    app.component('VueFinalModal', VueFinalModal)
    app.component('CodeBlock', CodeBlock)
    app.component('CodeBlockComponent', CodeBlockComponent)
    app.component('VButton', VButton)
  }
}

export default config
