import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

/** Used by the Cypress component tests and Vitest only: the library is built with tsdown. */
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
})
