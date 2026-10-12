import { useTemplate } from 'vue-use-template'
import SsrNotice from '../components/SsrNotice.vue'

export default defineNuxtPlugin(() => {
  if (useRequestURL().pathname === '/ssr/plugin')
    useTemplate({ component: SsrNotice, props: { text: 'Shown in a plugin' } }).show()
})
