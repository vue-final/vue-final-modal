// @vitest-environment jsdom

import type { InjectionKey } from 'vue'
import { describe, expect, it } from 'vitest'
import { createApp, defineComponent, h } from 'vue'
import { createInstanceResolver } from './createInstanceResolver'

interface Thing { name: string }

function setup() {
  const key: InjectionKey<Thing> = Symbol('thing')
  return { key, resolver: createInstanceResolver(key) }
}

describe('createInstanceResolver in the browser', () => {
  it('resolves the injected instance inside setup', () => {
    const { key, resolver } = setup()
    const provided: Thing = { name: 'provided' }
    resolver.setActive({ name: 'active' })
    let resolved: Thing | undefined

    const app = createApp(defineComponent({
      setup() {
        resolved = resolver.resolve()
        return () => h('p')
      },
    }))
    app.provide(key, provided)
    app.mount(document.createElement('div'))

    expect(resolved).toBe(provided)
  })

  it('resolves inside app.runWithContext() without a component instance', () => {
    const { key, resolver } = setup()
    const provided: Thing = { name: 'provided' }
    resolver.setActive({ name: 'active' })
    const app = createApp({ render: () => h('p') })
    app.provide(key, provided)

    expect(app.runWithContext(() => resolver.resolve())).toBe(provided)
  })

  it('falls back to the active instance outside setup', () => {
    const { resolver } = setup()
    const active: Thing = { name: 'active' }
    resolver.setActive(active)

    expect(resolver.resolve()).toBe(active)
  })

  it('prefers an explicitly passed instance over everything', () => {
    const { resolver } = setup()
    resolver.setActive({ name: 'active' })
    const explicit: Thing = { name: 'explicit' }

    expect(resolver.resolve(explicit)).toBe(explicit)
  })

  it('resolves to undefined when nothing is registered', () => {
    const { resolver } = setup()

    expect(resolver.resolve()).toBeUndefined()
  })
})
