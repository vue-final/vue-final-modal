import path from 'path'
import { defineConfig } from 'vite'
import vueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue'
import viteplay from '@viteplay/plugin'

export default defineConfig({
  root: './viteplay',
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, 'src')}`,
      'vue-final-modal': `${path.resolve(__dirname, 'src/index')}`,
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
          component: './src/components/VueFinalModal/VueFinalModal.vue',
          examples: '../../../viteplay/src/components/VueFinalModal/*.example.vue',
        },
        {
          title: 'VBottomSheet',
          component: './src/components/VBottomSheet/VBottomSheet.vue',
          examples: '../../../viteplay/src/components/VBottomSheet/*.example.vue',
        },
        {
          title: 'VFullscreen',
          component: './src/components/VFullscreen/VFullscreen.vue',
          examples: '../../../viteplay/src/components/VFullscreen/*.example.vue',
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
