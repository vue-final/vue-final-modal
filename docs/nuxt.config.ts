export default defineNuxtConfig({
  extends: ['docus'],
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
