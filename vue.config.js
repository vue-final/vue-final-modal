const VueAutomaticImportPlugin = require('vue-automatic-import-loader/lib/plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-final-modal/' : '/',
  configureWebpack: {
    plugins: [
      new VueAutomaticImportPlugin({
        match(originalTag, { kebabTag, camelTag }) {
          if (kebabTag.startsWith('base-')) {
            return [
              camelTag,
              `import ${camelTag} from '@/components/${camelTag}.vue'`
            ]
          }
        }
      })
    ]
  },
  css: {
    extract: false
  }
}
