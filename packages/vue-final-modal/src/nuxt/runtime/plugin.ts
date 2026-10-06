import { defineNuxtPlugin } from 'nuxt/app'
import { createVfm } from 'vue-final-modal'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createVfm())
})
