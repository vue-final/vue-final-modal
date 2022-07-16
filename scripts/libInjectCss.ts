import fs from 'fs'
import { resolve } from 'path'
import type { PluginOption, ResolvedConfig } from 'vite'

const fileRegex = /\.(css)$/

const injectCode = (code: string) =>
  `function styleInject(css,ref){if(ref===void 0){ref={}}var insertAt=ref.insertAt;if(!css||typeof document==="undefined"){return}var head=document.head||document.getElementsByTagName("head")[0];var style=document.createElement("style");style.type="text/css";if(insertAt==="top"){if(head.firstChild){head.insertBefore(style,head.firstChild)}else{head.appendChild(style)}}else{head.appendChild(style)}if(style.styleSheet){style.styleSheet.cssText=css}else{style.appendChild(document.createTextNode(css))}};styleInject(\`${code}\`)`
const template = 'console.warn("__INJECT__")'

let viteConfig: ResolvedConfig
const css: string[] = []

export default function libInjectCss(): PluginOption {
  return {
    name: 'lib-inject-css',

    apply: 'build',

    configResolved(resolvedConfig) {
      viteConfig = resolvedConfig
    },

    transform(code, id) {
      if (fileRegex.test(id)) {
        css.push(code)
        return {
          code: '',
        }
      }
      if (
        viteConfig.build.lib
         && 'entry' in viteConfig.build.lib
         && id.includes(viteConfig.build.lib.entry)) {
        return {
          code: `${code}
          ${template}`,
        }
      }
      return null
    },

    async writeBundle(_, bundle) {
      for (const file of Object.entries(bundle)) {
        const { root } = viteConfig
        const outDir: string = viteConfig.build.outDir || 'dist'
        const fileName: string = file[0]
        const filePath: string = resolve(root, outDir, fileName)

        try {
          let data: string = fs.readFileSync(filePath, {
            encoding: 'utf8',
          })

          if (data.includes(template))
            data = data.replace(template, injectCode(css.join('\n')))

          fs.writeFileSync(filePath, data)
        }
        catch (e) {
          console.error(e)
        }
      }
    },
  }
}
