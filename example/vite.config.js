import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ViteComponents from 'vite-plugin-components'
import WindiCSS from 'vite-plugin-windicss'

export default defineConfig({
  plugins: [vue(), ViteComponents(), WindiCSS()]
})
