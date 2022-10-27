// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  colorMode: {
    preference: 'dark',
  },
  telemetry: false,
  css: ['vue-final-modal/style.css'],
})
