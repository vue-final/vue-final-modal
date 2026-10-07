import type { Plugin } from 'nuxt/app'
import { markServer } from 'vue-use-template'
import { defineNuxtPlugin } from '#imports'

/** A server that polyfills window looks like a browser to vue-use-template until it is marked. */
const plugin: Plugin = defineNuxtPlugin({
  name: 'vue-final-modal:server',
  enforce: 'pre',
  setup() {
    markServer()
  },
})

export default plugin
