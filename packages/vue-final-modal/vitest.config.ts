import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    /** vue-use-template remembers whether this process has rendered on the server: inlined, vi.resetModules() gives the server and the browser of a hydration test one each. */
    server: { deps: { inline: ['vue-use-template'] } },
  },
}))
