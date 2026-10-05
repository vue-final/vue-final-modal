import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

/** Used by Cypress component testing only — the library is built with tsdown. */
export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    Vue(),
  ],
  publicDir: false,
  define: {
    __DEV__: JSON.stringify(!process.env.prod),
  },
})
