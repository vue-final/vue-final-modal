export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/logo.svg' }],
    },
  },
  content: {
    highlight: {
      preload: ['xml'],
    },
  },
  nitro: {
    prerender: {
      routes: [
        '/',
      ],
    },
  },
  extends: process.env.DOCUS_THEME_PATH || '@nuxt-themes/docus',
  colorMode: {
    preference: 'dark',
  },
  modules: ['@nuxt/ui', '@vue-final-modal/nuxt'],
})
