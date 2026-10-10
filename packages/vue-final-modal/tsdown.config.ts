import path from 'node:path'
import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

function library(): UserConfig {
  return {
    entry: ['./src/index.ts'],
    platform: 'neutral',
    plugins: [Vue({ isProduction: true })],
    alias: {
      '~': path.resolve(import.meta.dirname, 'src'),
    },
    define: {
      __DEV__: JSON.stringify(!process.env.prod),
    },
  }
}

export default defineConfig([
  {
    ...library(),
    format: ['esm', 'cjs'],
    dts: { vue: true },
  },
  {
    ...library(),
    format: ['umd'],
    /** Neither ships a browser build that defines a global, so the UMD build carries them. */
    deps: { alwaysBundle: ['vue-use-template', '@hunterliu/scroll-lock'] },
    /** Only CDN users load it, and they have no build step of their own to minify it. */
    minify: true,
    outputOptions: {
      name: 'VueFinalModal',
      globals: {
        'vue': 'Vue',
        '@vueuse/core': 'VueUse',
        /** The VueUse integrations IIFE builds add their functions to the VueUse global. */
        '@vueuse/integrations/useFocusTrap': 'VueUse',
      },
    },
  },
  {
    /** The Nuxt module and its runtime plugin, served as `vue-final-modal/nuxt`. The plugin must import the package itself, not the sources, so the app and the plugin share one vfm. */
    entry: {
      'nuxt/module': './src/nuxt/module.ts',
      'nuxt/runtime/plugin': './src/nuxt/runtime/plugin.ts',
      'nuxt/runtime/server': './src/nuxt/runtime/server.ts',
    },
    platform: 'node',
    format: ['esm'],
    /** `@nuxt/schema` is only reached through the inferred module type; left external, its declarations are not inlined. */
    deps: { neverBundle: [/^@nuxt\//, /^nuxt(\/|$)/, /^#/, 'vue-final-modal'] },
    dts: true,
    /** Both builds write into dist; the package build script empties it first. */
    clean: false,
  },
])
