import { fileURLToPath } from 'node:url'
import { loadNuxt } from '@nuxt/kit'
import type { Component, NuxtConfig, NuxtHooks } from 'nuxt/schema'
import { describe, expect, it } from 'vitest'
import type { ModuleOptions } from './module'
import vueFinalModal from './module'

async function autoImported(options?: ModuleOptions) {
  const nuxt = await loadNuxt({
    cwd: fileURLToPath(new URL('../..', import.meta.url)),
    overrides: { modules: [vueFinalModal], vueFinalModal: options, telemetry: false } as NuxtConfig,
  })
  const imports: Parameters<NuxtHooks['imports:extend']>[0] = []
  const components: Component[] = []
  try {
    await nuxt.callHook('imports:extend', imports)
    await nuxt.callHook('components:extend', components)
  }
  finally {
    await nuxt.close()
  }
  return {
    imports: imports.filter(i => i.from === 'vue-final-modal').map(i => i.name),
    components: components.filter(c => c.filePath === 'vue-final-modal').map(c => c.pascalName),
  }
}

describe('the Nuxt module', () => {
  it('auto-imports the composables and components', async () => {
    expect(await autoImported()).toEqual({
      imports: ['useModal', 'useModalSlot', 'useVfm', 'useVfmAttrs', 'defineModal', 'defineTemplate'],
      components: ['VueFinalModal', 'ModalsContainer'],
    })
  })

  it('auto-imports nothing with autoImports: false', async () => {
    expect(await autoImported({ autoImports: false })).toEqual({ imports: [], components: [] })
  })
})
