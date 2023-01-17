import { createVfm } from 'vue-final-modal'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm()

  nuxtApp.vueApp.use(vfm)
})
