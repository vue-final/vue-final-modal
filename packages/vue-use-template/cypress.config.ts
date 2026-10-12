import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    video: false,
    screenshotOnRunFailure: false,
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: false,
  },
  component: {
    video: false,
    screenshotOnRunFailure: false,
    devServer: {
      framework: 'vue',
      bundler: 'vite',
      viteConfig: {
        plugins: [vue()],
        resolve: {
          alias: {
            'vue-use-template': fileURLToPath(new URL('./src/index.ts', import.meta.url)),
          },
        },
      },
    },
  },
})
