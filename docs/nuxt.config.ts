export default defineNuxtConfig({
  extends: ['docus'],
  modules: [
    'vue-final-modal/nuxt',
    /** docus turns its AI assistant on whenever the build sees VERCEL_OIDC_TOKEN, but these docs have no assistant backend. */
    (_options, nuxt) => {
      nuxt.hook('modules:done', () => {
        nuxt.options.runtimeConfig.public.assistant = { ...nuxt.options.runtimeConfig.public.assistant, enabled: false }
      })
    },
  ],
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
