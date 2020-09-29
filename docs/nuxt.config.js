import theme from '@nuxt/content-theme-docs'
import path from 'path'

const env = {
  ...(process.env.NODE_ENV === 'production' && {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  })
}

export default theme({
  env,
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
  }
})
