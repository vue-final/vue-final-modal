const VueAutomaticImportPlugin = require('vue-automatic-import-loader/lib/plugin')

module.exports = {
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
  }
}
