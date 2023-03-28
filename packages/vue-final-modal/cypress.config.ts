import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    video: false,
    screenshotOnRunFailure: false,
    specPattern: 'cypress/components/**/*.spec.ts',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
