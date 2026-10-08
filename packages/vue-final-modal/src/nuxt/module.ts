import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'vue-final-modal',
    configKey: 'vue-final-modal',
    compatibility: {
      nuxt: '>=3.8.0',
    },
  },
  setup(_options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.build.transpile.push(resolve('./runtime'))

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: 'vue-final-modal/nuxt' })
    })

    // Added after the other modules so the plugin runs before the router plugin
    // https://github.com/nuxt/framework/issues/9130
    nuxt.hook('modules:done', () => {
      addPlugin(resolve('./runtime/plugin'))
      addPlugin({ src: resolve('./runtime/server'), mode: 'server' })
    })

    nuxt.options.css.push('vue-final-modal/style.css')
  },
})
