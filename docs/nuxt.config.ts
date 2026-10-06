export default defineNuxtConfig({
  extends: ['docus'],
  modules: ['vue-final-modal/nuxt'],
  site: {
    name: 'Vue Final Modal',
  },
  components: [
    {
      path: '~/components/content',
      global: true,
      pathPrefix: false,
    },
    '~/components',
  ],
})
