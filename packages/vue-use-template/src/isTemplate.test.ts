import { describe, expect, it, vi } from 'vitest'
import { computed, h, reactive, ref } from 'vue'
import { isTemplate } from './utils'

const template = { component: () => h('p') }

describe('isTemplate', () => {
  it('recognizes a template, also inside a ref, computed ref or reactive object', () => {
    expect(isTemplate(template)).toBe(true)
    expect(isTemplate(ref(template))).toBe(true)
    expect(isTemplate(computed(() => template))).toBe(true)
    expect(isTemplate(reactive({ ...template }))).toBe(true)
  })

  it('does not call a functional component to inspect it', () => {
    const FunctionalComponent = vi.fn(() => h('p'))

    expect(isTemplate(FunctionalComponent)).toBe(false)
    expect(FunctionalComponent).not.toHaveBeenCalled()
  })

  it('does not call a getter to inspect it', () => {
    const getter = vi.fn(() => template)

    expect(isTemplate(getter)).toBe(false)
    expect(getter).not.toHaveBeenCalled()
  })

  it('rejects values without a component', () => {
    for (const value of [undefined, null, 'text', {}, ref({})])
      expect(isTemplate(value)).toBe(false)
  })
})
