import { createVfm } from 'vue-final-modal'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm()

  nuxtApp.vueApp.use(vfm)
})
