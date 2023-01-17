import { parseFrontMatter } from 'remark-mdc'
import type { ParsedContent } from '../types'
import { defineTransformer } from './utils'

export default defineTransformer({
  name: 'Yaml',
  extensions: ['.yml', '.yaml'],
  parse: async (_id, content) => {
    const { data } = await parseFrontMatter(`---\n${content}\n---`)

    // Keep array contents under `body` key
    let parsed = data
    if (Array.isArray(data)) {
      console.warn(`YAML array is not supported in ${_id}, moving the array into the \`body\` key`)
      parsed = { body: data }
    }

    return <ParsedContent> {
      ...parsed,
      _id,
      _type: 'yaml',
    }
  },
})
