import path from 'path'
import { defineConfig } from 'vite'
import vueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue'
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
    vueMacros({
      plugins: {
        vue: vue(),
      },
    }),
    viteplay({
      pages: [
        {
          title: 'VueFinalModal',
          component: `${componentPath}/VueFinalModal/VueFinalModal.vue`,
          examples: `${examplesPath}/VueFinalModal/*.example.vue`,
        },
        {
          title: 'VBottomSheet',
          component: `${componentPath}/VBottomSheet/VBottomSheet.vue`,
          examples: `${examplesPath}/VBottomSheet/*.example.vue`,
        },
        {
          title: 'VFullscreen',
          component: `${componentPath}/VFullscreen/VFullscreen.vue`,
          examples: `${examplesPath}/VFullscreen/*.example.vue`,
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
