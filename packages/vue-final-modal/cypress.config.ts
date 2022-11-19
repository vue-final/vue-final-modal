import { defineConfig } from 'cypress'

export default defineConfig({
  component: {
    specPattern: 'cypress/components/**/*.spec.ts',
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
