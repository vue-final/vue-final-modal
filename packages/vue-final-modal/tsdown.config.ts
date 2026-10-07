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
    outputOptions: {
      name: 'VueFinalModal',
      globals: {
        'vue': 'Vue',
        '@vueuse/core': 'VueUse',
        /** The VueUse integrations IIFE builds add their functions to the VueUse global. */
        '@vueuse/integrations/useFocusTrap': 'VueUse',
        'focus-trap': 'focusTrap',
      },
    },
  },
])
