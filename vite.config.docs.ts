import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import viteplay from '@viteplay/plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteplay({
      // Path to extract components from
      components: './src/components/*.vue',
      // Path to extract examples from, relative to component path
      componentExamples: ({ name }) => `./${name}.*.vue`,
      // base route for the development pages
      base: '/dev',
    }),
  ],
  build: {
    outDir: 'docs',
  },
})
