import theme from '@nuxt/content-theme-docs'
import path from 'path'

export default theme({
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  generate: {
    dir: 'docs'
  },
  plugins: [path.resolve('plugins') + '/global.js'],
  buildModules: [
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-170494825-1'
        // debug: {
        //   enabled: true,
        //   sendHitTask: true
        // }
      }
    ]
  ],
  build: {
    extractCSS: true
  },
  css: ['../example/src/assets/css/button.css'],
  modules: ['@nuxtjs/sitemap'],
  sitemap: {
    hostname: 'https://vue-final-modal.org',
    gzip: true,
    routes: async () => {
      let routes = []
      const { $content } = require('@nuxt/content')
      const posts = await $content('/', { deep: true }).fetch()
      for (const post of posts) {
        routes.push(`${post.to}`)
      }
      return routes
    }
  },
  content: {
    liveEdit: false
  }
})
