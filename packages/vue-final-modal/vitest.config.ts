import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    /** Inlined so vi.resetModules() hands out fresh copies of their module state: whether vue-use-template runs on a server, and the user agent scroll-lock read. */
    server: { deps: { inline: ['vue-use-template', '@hunterliu/scroll-lock'] } },
  },
}))
