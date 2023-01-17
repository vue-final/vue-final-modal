import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@vue-final-modal/nuxt',
    configKey: 'vue-final-modal',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    addPlugin(resolve('./runtime/plugin'))

    nuxt.options.css.push('vue-final-modal/style.css')
  },
})
