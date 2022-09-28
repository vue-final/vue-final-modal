import type { Plugin } from 'vite'

function VitePluginStyleInject(styleId = ''): Plugin {
  let styleCode = ''

  return {
    name: 'vite-plugin-style-inject',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key]
          if (chunk.type === 'asset' && chunk.fileName.includes('.css')) {
            styleCode += chunk.source
            delete bundle[key]
          }
        }
      }

      for (const key in bundle) {
        if (bundle[key]) {
          const chunk = bundle[key]
          if (chunk.type === 'chunk'
            && chunk.fileName.match(/.[cm]?js$/) !== null
            && !chunk.fileName.includes('polyfill')
          ) {
            const initialCode = chunk.code
            chunk.code = '(function(){ try {var elementStyle = document.createElement(\'style\'); elementStyle.appendChild(document.createTextNode('
            chunk.code += JSON.stringify(styleCode.trim())
            chunk.code += ')); '
            if (styleId.length > 0)
              chunk.code += ` elementStyle.id = "${styleId}"; `
            chunk.code += 'document.head.appendChild(elementStyle);} catch(e) {} })();'
            chunk.code += initialCode
            break
          }
        }
      }
    },
  }
}

export default VitePluginStyleInject
