import path from 'path'
import { defineConfig } from 'vite'
import vueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue'
import viteplay from '@viteplay/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, '../vue-final-modal/src')}`,
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
          component: '../vue-final-modal/src/components/VueFinalModal/VueFinalModal.vue',
          examples: '../../../../viteplay/src/components/VueFinalModal/*.example.vue',
        },
        {
          title: 'VBottomSheet',
          component: '../vue-final-modal/src/components/VBottomSheet/VBottomSheet.vue',
          examples: '../../../../viteplay/src/components/VBottomSheet/*.example.vue',
        },
        {
          title: 'VFullscreen',
          component: '../vue-final-modal/src/components/VFullscreen/VFullscreen.vue',
          examples: '../../../../viteplay/src/components/VFullscreen/*.example.vue',
        },
      ],
      // base route for the development pages
      base: '/viteplay',
    }),
  ],
  build: {
    outDir: 'docs',
  },
})
