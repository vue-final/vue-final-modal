import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import viteplay from '@viteplay/plugin'

const componentPath = '../packages/vue-final-modal/src/components'
const examplesPath = '../../../../viteplay/src/components'

export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    Vue(),
    viteplay({
      pages: [
        {
          title: 'VueFinalModal',
          component: `${componentPath}/VueFinalModal.vue`,
          examples: `${examplesPath}/*.example.vue`,
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
