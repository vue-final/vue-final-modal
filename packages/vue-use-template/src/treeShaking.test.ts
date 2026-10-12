import type { Rolldown } from 'vite'
import { fileURLToPath } from 'node:url'
import { runInNewContext } from 'node:vm'
import { build } from 'vite'
import { describe, expect, it, onTestFinished, vi } from 'vitest'

const entry = fileURLToPath(new URL('./index.ts', import.meta.url))
/** Vite 8 minifies with Oxc, which prints strings in backticks. */
const providerName = /["'`]TemplateProvider["'`]/

async function bundle(imports: string[], external = ['vue', '@vueuse/core'], usage = `console.log(${imports.join(', ')})`) {
  /** Vite inlines NODE_ENV, which Vitest sets to `test`; a consumer's production build sees `production`. */
  vi.stubEnv('NODE_ENV', 'production')
  onTestFinished(() => {
    vi.unstubAllEnvs()
  })
  const result = await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      minify: true,
      rolldownOptions: {
        input: 'virtual:consumer',
        external,
      },
    },
    plugins: [{
      name: 'consumer',
      enforce: 'pre',
      resolveId(id) {
        if (id === 'virtual:consumer')
          return '\0consumer'
        /** The published build is one module, where the @__PURE__ annotations decide what bundlers drop; sideEffects: false would let Rolldown skip src/index.ts whole when only its re-exports are used. */
        if (id === entry)
          return { id, moduleSideEffects: true }
        return null
      },
      load: id => (id === '\0consumer'
        ? `import { ${imports.join(', ')} } from ${JSON.stringify(entry)}\n${usage}`
        : null),
    }],
  }) as Rolldown.RolldownOutput
  return result.output[0].code
}

describe('tree shaking', () => {
  it('drops the default provider when only the template helpers are imported', async () => {
    expect(await bundle(['templateToVNodeFn', 'defineTemplate'])).not.toMatch(providerName)
  })

  it('keeps the default provider when it is imported', async () => {
    expect(await bundle(['TemplateProvider', 'useTemplate'])).toMatch(providerName)
  })

  it('never logs the development warning from production bundles', async () => {
    /** Rolldown keeps the call to Vue's production warn() and the warning's text, but that warn() does nothing. */
    const warn = vi.fn()

    runInNewContext(await bundle(['useTemplate'], [], 'useTemplate({ component: () => null }).show()'), { console: { warn } })

    expect(warn).not.toHaveBeenCalled()
  })

  it('does not import @vueuse/core', async () => {
    expect(await bundle(['TemplateProvider', 'useTemplate', 'createTemplateProvider'])).not.toContain('@vueuse/core')
  })
})
