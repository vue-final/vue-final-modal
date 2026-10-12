import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'

const repository = 'https://github.com/vue-final/vue-final-modal/tree/v5/packages/vue-use-template'

export default defineConfig({
  title: 'vue-use-template',
  description: 'Show Vue components on demand from anywhere, rendered in one place, with server rendering support.',
  sitemap: {
    hostname: 'https://vue-use-template.hunterliu.tw',
  },
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'API', link: '/guide#api' },
    ],
    socialLinks: [
      { icon: 'github', link: repository },
    ],
    outline: [2, 3],
  },
  vite: {
    resolve: {
      alias: {
        'vue-use-template': fileURLToPath(new URL('../../src/index.ts', import.meta.url)),
      },
    },
  },
})
