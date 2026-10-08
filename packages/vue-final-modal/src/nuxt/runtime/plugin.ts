import type { Plugin } from 'nuxt/app'
import { createVfm } from 'vue-final-modal'
import { defineNuxtPlugin } from '#imports'

/** Annotated, because `#imports` only resolves inside a Nuxt app and the declaration build would type the plugin as any. */
const plugin: Plugin = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(createVfm())
})

export default plugin
