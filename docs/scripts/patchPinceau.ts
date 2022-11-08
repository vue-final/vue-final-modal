import fs from 'fs'
import path from 'path'

const cwd = path.resolve('./')
const filePath = path.resolve('../node_modules/pinceau/dist/nuxt.cjs')

const nuxtCjs = fs.readFileSync(filePath, 'utf-8').split('\n')

const target = 'const layerPaths = nuxt.options._layers.reduce('
const result = `        if (layer?.cwd === '${cwd}') { return acc }`

const patched = nuxtCjs.findIndex(line => line.includes(result)) === -1

if (patched) {
  const line = nuxtCjs.findIndex(line => line.includes(target))

  if (line !== -1)
    nuxtCjs.splice(line + 2, 0, result)

  const newNuxtCjs = nuxtCjs.join('\n')

  fs.writeFileSync(filePath, newNuxtCjs, { encoding: 'utf-8' })
}
