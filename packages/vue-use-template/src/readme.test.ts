import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const root = new URL('../', import.meta.url)

function read(path: string) {
  return readFileSync(new URL(path, root), 'utf8')
}

const blocks = [...read('README.md').matchAll(/^<!-- source: (\S+) -->\n```\w+\n([\s\S]*?)^```$/gm)]
  .map(([, file, code]) => ({ file, code }))

describe('readme', () => {
  it('marks each full example with the file it comes from', () => {
    expect(blocks.map(({ file }) => file)).toEqual([
      'cypress/components/App.vue',
      'cypress/components/DialogConfirm.vue',
    ])
  })

  it.each(blocks)('shows $file unchanged', ({ file, code }) => {
    expect(code).toBe(read(file))
  })
})
