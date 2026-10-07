import { markServer } from 'vue-use-template'
import { defineNuxtPlugin } from '#imports'

/** A server that polyfills window looks like a browser to vue-use-template until it is marked. */
export default defineNuxtPlugin({
  name: 'vue-final-modal:server',
  enforce: 'pre',
  setup() {
    markServer()
  },
})
