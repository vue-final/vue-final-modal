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
        id: 'UA-170494825-1',
        debug: {
          enabled: true,
          sendHitTask: true
        }
      }
    ]
  ]
})
