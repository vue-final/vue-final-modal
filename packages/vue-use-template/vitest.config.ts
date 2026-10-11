import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    execArgv: ['--expose-gc'],
    typecheck: {
      enabled: true,
      checker: 'vue-tsc',
    },
  },
})
