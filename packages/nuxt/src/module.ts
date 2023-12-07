import { addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: '@vue-final-modal/nuxt',
    configKey: 'vue-final-modal',
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('./runtime'))

    nuxt.hook('prepare:types', ({ references }) => {
      references.push({ types: '@vue-final-modal/nuxt' })
    })

    // Add runtime plugin before the router plugin
    // https://github.com/nuxt/framework/issues/9130
    nuxt.hook('modules:done', () => {
      addPlugin(resolve('./runtime/plugin'))
    })

    nuxt.options.css.push('vue-final-modal/style.css')
  },
})
