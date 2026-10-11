import type { InjectionKey } from 'vue'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { createInstanceResolver } from './createInstanceResolver'

const tick = () => new Promise(resolve => setTimeout(resolve))

describe('createInstanceResolver on the server', () => {
  it('never falls back to the active instance outside setup', () => {
    const resolver = createInstanceResolver(Symbol('thing') as InjectionKey<string>)
    resolver.setActive('active')

    expect(resolver.resolve()).toBeUndefined()
  })

  it('never hands one request the instance of a concurrent request after an await', async () => {
    const resolver = createInstanceResolver(Symbol('thing') as InjectionKey<string>)
    async function request(name: string) {
      resolver.setActive(name)
      await tick()
      return resolver.resolve()
    }

    expect(await Promise.all([request('first'), request('second')])).toEqual([undefined, undefined])
  })

  it('still resolves the injected instance in app.runWithContext()', () => {
    const key: InjectionKey<string> = Symbol('thing')
    const resolver = createInstanceResolver(key)
    const app = createSSRApp({ render: () => h('p') })
    app.provide(key, 'provided')

    expect(app.runWithContext(() => resolver.resolve())).toBe('provided')
  })
})
