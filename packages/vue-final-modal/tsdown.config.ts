import path from 'node:path'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

export default defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  format: ['esm', 'cjs', 'umd'],
  plugins: [Vue({ isProduction: true })],
  dts: { vue: true },
  alias: {
    '~': path.resolve(import.meta.dirname, 'src'),
  },
  define: {
    __DEV__: JSON.stringify(!process.env.prod),
  },
  outputOptions: {
    name: 'VueFinalModal',
    globals: {
      'vue': 'Vue',
      '@vueuse/core': 'VueUse',
      '@vueuse/integrations/useFocusTrap': 'VueUseFocusTrap',
      'focus-trap': 'FocusTrap',
      'vue-use-template': 'VueUseTemplate',
      '@hunterliu/scroll-lock': 'ScrollLock',
    },
  },
})
