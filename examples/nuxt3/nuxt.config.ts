// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  modules: ['@vue-final-modal/nuxt'],
  colorMode: {
    preference: 'dark',
  },
  telemetry: false,
})
