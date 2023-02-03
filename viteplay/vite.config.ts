import path from 'path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import VueMacros from 'unplugin-vue-macros/vite'
import DefineOptions from 'unplugin-vue-define-options/vite'
import viteplay from '@viteplay/plugin'

const componentPath = '../packages/vue-final-modal/src/components'
const examplesPath = '../../../../../viteplay/src/components'

export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),
    DefineOptions(),
    viteplay({
      pages: [
        {
          title: 'VueFinalModal',
          component: `${componentPath}/VueFinalModal/VueFinalModal.vue`,
          examples: `${examplesPath}/VueFinalModal/*.example.vue`,
        },
      ],
      // base route for the development pages
      base: '/viteplay',
    }),
  ],
  build: {
    outDir: 'playground',
  },
  define: {
    __DEV__: JSON.stringify(!process.env.prod),
  },
})
