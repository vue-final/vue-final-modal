import path from 'path'
import fs from 'node:fs'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const _path = path.resolve(`./components/content/${query.path}`)

  const content = fs.readFileSync(_path, 'utf-8')

  return {
    content,
  }
})
