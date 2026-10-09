import { addComponent, addImports, addPlugin, createResolver, defineNuxtModule } from '@nuxt/kit'
import type * as vfm from '../index'

export interface ModuleOptions {
  /**
   * Turn it off when another module auto-imports the same names, such as its own `useModal()`.
   * @default true
   */
  autoImports?: boolean
}

const composables = ['useModal', 'useModalSlot', 'useVfm', 'useVfmAttrs', 'defineModal', 'defineTemplate'] satisfies (keyof typeof vfm)[]
const components = ['VueFinalModal', 'ModalsContainer'] satisfies (keyof typeof vfm)[]

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'vue-final-modal',
    configKey: 'vueFinalModal',
    compatibility: {
      nuxt: '>=3.8.0',
    },
  },
  defaults: {
    autoImports: true,
  },
  setup(options, nuxt) {
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

    if (options.autoImports) {
      addImports(composables.map(name => ({ name, from: 'vue-final-modal' })))
      for (const name of components)
        addComponent({ name, export: name, filePath: 'vue-final-modal' })
    }
  },
})
