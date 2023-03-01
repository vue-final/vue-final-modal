import { createVfm } from 'vue-final-modal'

export default defineNuxtPlugin((nuxtApp) => {
  const vfm = createVfm()
  nuxtApp.vueApp.use(vfm)
})
