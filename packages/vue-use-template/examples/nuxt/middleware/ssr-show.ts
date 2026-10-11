import { useTemplate } from 'vue-use-template'
import SsrNotice from '../components/SsrNotice.vue'

export default defineNuxtRouteMiddleware(() => {
  useTemplate({ component: SsrNotice, props: { text: 'Shown in route middleware' } }).show()
})
