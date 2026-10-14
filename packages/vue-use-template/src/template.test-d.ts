import type { Component, InjectionKey, PropType, Ref, SlotsType } from 'vue'
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
      props: { title: 'Hello' },
      emits: {
        onConfirm: value => expectTypeOf(value).toEqualTypeOf<number>(),
        onCancel: () => {},
      },
    })
    // @ts-expect-error emits take on* listeners only
    defineTemplate({ component: Dialog, emits: { title: 'Hello' } })
    // @ts-expect-error confirm sends a number
    defineTemplate({ component: Dialog, props: { title: 'Hello' }, emits: { onConfirm: (_value: string) => {} } })
  })

  it('checks props given as a ref, a computed ref or a getter', () => {
    defineTemplate({ component: Dialog, props: ref({ title: 'Hello' }) })
    defineTemplate({ component: Dialog, props: computed(() => ({ title: 'Hello' })) })
    defineTemplate({ component: Dialog, props: () => ({ title: 'Hello' }) })
    // @ts-expect-error title is a string
    defineTemplate({ component: Dialog, props: () => ({ title: 1 }) })
  })

  it('takes only the slots the component declares', () => {
    defineTemplate({ component: Dialog, props: { title: 'Hello' }, slots: { default: 'Hello', footer: Dialog } })
    // @ts-expect-error Dialog has no header slot
    defineTemplate({ component: Dialog, props: { title: 'Hello' }, slots: { header: 'Hello' } })
  })
})

describe('required props', () => {
  const Form = defineComponent({
    props: { title: { type: String, required: true }, count: { type: Number, required: true }, note: String },
    setup: () => () => null,
  })
  const Plain = defineComponent({ props: { note: String }, setup: () => () => null })
  const title = ref('Hello')

  it('takes each required prop from attrs or from props', () => {
    defineTemplate({ component: Form, attrs: { title: 'Hello' }, props: { count: 1 } })
    defineTemplate({ component: Form, attrs: { class: 'z-50', style: { top: '0' } }, props: computed(() => ({ title: title.value, count: 1 })) })
    defineTemplate({ component: Form, attrs: () => ({ title: title.value, count: 1, class: 'form' }) })
    defineTemplate({ component: Form, attrs: computed(() => ({ title: title.value })), props: () => ({ count: 1 }) })
  })

  it('rejects a required prop given nowhere', () => {
    // @ts-expect-error count is missing
    defineTemplate({ component: Form, attrs: { title: 'Hello' }, props: { note: 'x' } })
    // @ts-expect-error count is missing
    defineTemplate({ component: Form, attrs: { title: 'Hello' } })
    // @ts-expect-error count is missing from the getter too
    defineTemplate({ component: Form, attrs: () => ({ title: 'Hello' }) })
    // @ts-expect-error title and count are missing
    defineTemplate({ component: Form, attrs: { class: 'z-50' } })
    // @ts-expect-error title and count are missing
    defineTemplate({ component: Form })
    // @ts-expect-error title and count are missing
    useTemplate(() => ({ component: Form, attrs: { class: 'z-50' } }))
  })

  it('still checks the values and the names in attrs', () => {
    // @ts-expect-error title is a string
    defineTemplate({ component: Form, attrs: { title: 1, count: 1 } })
    // @ts-expect-error Form has no subtitle prop
    defineTemplate({ component: Form, attrs: { title: 'Hello', count: 1, subtitle: 'x' } })
    // @ts-expect-error count is a number
    defineTemplate({ component: Form, attrs: { title: 'Hello' }, props: { count: 'x' } })
  })

  it('types the listeners given in attrs by the event payload', () => {
    defineTemplate({ component: Dialog, attrs: { title: 'Hello', onConfirm: value => expectTypeOf(value).toEqualTypeOf<number>() } })
    defineTemplate({ component: Dialog, attrs: () => ({ title: 'Hello', onConfirm: value => expectTypeOf(value).toEqualTypeOf<number>() }) })
  })

  it('takes attrs that may leave a name out, as a conditional spread does', () => {
    const optional = (show: boolean) => ({ ...(show ? { note: 'x' } : {}) })
    defineTemplate({ component: Form, attrs: { title: 'Hello', count: 1, ...optional(true) } })
  })

  it('takes a ref for an attr', () => {
    defineTemplate({ component: Form, attrs: { title, count: ref(1) } })
    defineTemplate({ component: Form, attrs: { title }, props: { count: 1 } })
    // @ts-expect-error title is a string
    defineTemplate({ component: Form, attrs: { title: ref(1), count: 1 } })
  })

  it('takes a prop that is a ref itself in props only, since attrs unwraps refs', () => {
    const Counter = defineComponent({
      props: { count: { type: Object as PropType<Ref<number>>, required: true }, label: String, anything: null as unknown as PropType<any> },
      setup: () => () => null,
    })
    const count = ref(0)
    defineTemplate({ component: Counter, props: { count } })
    defineTemplate({ component: Counter, attrs: { label: 'Count', anything: ref(1) }, props: { count } })
    // @ts-expect-error count takes a ref itself, which attrs would unwrap
    defineTemplate({ component: Counter, attrs: { count } })
  })

  it('keeps attrs and props optional for a component without required props', () => {
    defineTemplate({ component: Plain })
    defineTemplate({ component: Plain, attrs: { class: 'plain' } })
  })

  it('lets a template typed by hand give any of the props in attrs', () => {
    const template: Template<typeof Form> = { component: Form, attrs: { title: 'Hello', count: 1 } }
    expectTypeOf(template.component).toEqualTypeOf<typeof Form>()
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
