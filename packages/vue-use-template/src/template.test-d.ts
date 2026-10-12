import type { Component, InjectionKey, SlotsType } from 'vue'
import type { Template } from './types'
import { describe, expectTypeOf, it } from 'vitest'
import { computed, defineComponent, ref } from 'vue'
import { createInstanceResolver, defineTemplate, isTemplate, useTemplate } from './index'

const Dialog = defineComponent({
  props: {
    title: { type: String, required: true },
    count: Number,
  },
  emits: {
    confirm: (_value: number) => true,
    cancel: () => true,
  },
  slots: Object as SlotsType<{ default: () => unknown, footer: () => unknown }>,
  setup: () => () => null,
})

describe('Template', () => {
  it('checks props against the component', () => {
    defineTemplate({ component: Dialog, props: { title: 'Hello', count: 1 } })
    // @ts-expect-error title is a string
    defineTemplate({ component: Dialog, props: { title: 1 } })
    // @ts-expect-error Dialog has no subtitle prop
    defineTemplate({ component: Dialog, props: { title: 'Hello', subtitle: 'x' } })
  })

  it('keeps event listeners out of props', () => {
    // @ts-expect-error listeners go in emits
    defineTemplate({ component: Dialog, props: { title: 'Hello', onConfirm: () => {} } })
  })

  it('takes only listeners in emits, typed by the event payload', () => {
    defineTemplate({
      component: Dialog,
      emits: {
        onConfirm: value => expectTypeOf(value).toEqualTypeOf<number>(),
        onCancel: () => {},
      },
    })
    // @ts-expect-error emits take on* listeners only
    defineTemplate({ component: Dialog, emits: { title: 'Hello' } })
    // @ts-expect-error confirm sends a number
    defineTemplate({ component: Dialog, emits: { onConfirm: (_value: string) => {} } })
  })

  it('checks props given as a ref, a computed ref or a getter', () => {
    defineTemplate({ component: Dialog, props: ref({ title: 'Hello' }) })
    defineTemplate({ component: Dialog, props: computed(() => ({ title: 'Hello' })) })
    defineTemplate({ component: Dialog, props: () => ({ title: 'Hello' }) })
    // @ts-expect-error title is a string
    defineTemplate({ component: Dialog, props: () => ({ title: 1 }) })
  })

  it('takes only the slots the component declares', () => {
    defineTemplate({ component: Dialog, slots: { default: 'Hello', footer: Dialog } })
    // @ts-expect-error Dialog has no header slot
    defineTemplate({ component: Dialog, slots: { header: 'Hello' } })
  })
})

describe('useTemplate', () => {
  it('infers the component through a getter and returns show, hide and ignored', () => {
    expectTypeOf(useTemplate(() => ({ component: Dialog, props: { title: 'Hello' } })))
      .toEqualTypeOf<{ show: () => void, hide: () => void, ignored: boolean }>()
    // @ts-expect-error title is a string
    useTemplate(() => ({ component: Dialog, props: { title: 1 } }))
  })
})

describe('isTemplate', () => {
  it('narrows an unknown value to a template', () => {
    const value: unknown = { component: Dialog }
    if (isTemplate(value))
      expectTypeOf(value).toEqualTypeOf<Template<Component>>()
  })
})

describe('createInstanceResolver', () => {
  it('resolves to the instance type of its key', () => {
    const key: InjectionKey<{ name: string }> = Symbol('instance')
    expectTypeOf(createInstanceResolver(key).resolve()).toEqualTypeOf<{ name: string } | undefined>()
  })
})
