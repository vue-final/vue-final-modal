export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      }
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
})
