import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteplay from '@viteplay/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    vue(),
    viteplay({
      pages: [
        {
          title: 'VueFinalModal',
          component: './src/components/VueFinalModal/VueFinalModal.vue',
          examples: './*.example.vue',
        },
        {
          title: 'VBottomSheet',
          component: './src/components/VBottomSheet/VBottomSheet.vue',
          examples: './*.example.vue',
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
