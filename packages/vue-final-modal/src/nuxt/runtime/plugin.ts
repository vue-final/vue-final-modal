import { createVfm } from 'vue-final-modal'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createVfm())
})
