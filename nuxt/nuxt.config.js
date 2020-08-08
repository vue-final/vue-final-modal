import theme from '@nuxt/content-theme-docs'
import path from 'path'

export default theme({
  generate: {
    dir: 'docs'
  },
  plugins: [path.resolve('plugins') + '/global.js']
})
