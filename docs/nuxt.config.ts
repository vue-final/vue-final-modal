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
  vite: {
    resolve: {
      /** vue-final-modal, linked from the workspace, resolves the @vueuse/core 10 it is developed against, and the dev server prebundles one copy for every importer: Nuxt UI renders with 14 on the server and would hydrate with 10. */
      dedupe: ['@vueuse/core'],
    },
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
