import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteplay from '@viteplay/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteplay({
      // Path to extract components from to create dev pages for
      components: './src/components/*/*.vue',
      // Path to extract component examples from to put on each dev page
      componentExamples: './src/components/*/examples/**/*.vue',
      base: '/dev',
    }),
  ],
  build: {
    outDir: 'docs',
  },
})
