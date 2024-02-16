import type { Component } from 'vue'
import { markRaw, reactive } from 'vue'
import type { Template } from 'vue-use-template'
import { isTemplate, useTemplate } from 'vue-use-template'
import { UseModal } from '~/components/UseModal'
import { isString, objectEntries } from '~/utils'
import VueFinalModal from '~/components/VueFinalModal.vue'
import type { UseModalReturnType, UseModalTemplate, UseModalTemplatePrivate } from '~/types'

/**
 * Create a dynamic modal.
 */
export function useModal<T extends Component = typeof VueFinalModal>(_template: UseModalTemplate<T>): UseModalReturnType<T> {
  const id = Symbol(__DEV__ ? 'useModal' : '')

  const template = reactive({
    id,
    modelValue: !!_template?.defaultModelValue,
    resolveOpened: () => { },
    resolveClosed: tryRemoveVNode,
    attrs: {},
    ...withMarkRaw<T>(_template),
  }) as UseModalTemplate<T> & UseModalTemplatePrivate

  const { show, hide } = useTemplate({
    component: UseModal,
    attrs: { template, key: id },
  }, {
    onUnmounted: () => tryRemoveVNode(),
  })

  if (template.modelValue === true)
    show()

  function open(): Promise<string> {
    if (template.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already opened.')

    tryRemoveVNode()
    template.modelValue = true
    show()

    return new Promise((resolve) => {
      template.resolveOpened = () => resolve('opened')
    })
  }

  function close(): Promise<string> {
    if (!template.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already closed.')

    template.modelValue = false
    return new Promise((resolve) => {
      template.resolveClosed = () => {
        resolve('closed')
        tryRemoveVNode()
      }
    })
  }

  function tryRemoveVNode() {
    if (template.keepAlive)
      return
    hide()
  }

  function patchTemplate(_template: Partial<UseModalTemplate<T>>) {
    const { slots, ...rest } = withMarkRaw(_template, template.component)

    if (_template.defaultModelValue !== undefined)
      template.defaultModelValue = _template.defaultModelValue
    if (_template?.keepAlive !== undefined)
      template.keepAlive = _template?.keepAlive

    // patch template.component and template.attrs
    patchTemplateComponentAndAttrs(template, rest)

    // patch template.slots
    if (slots) {
      objectEntries(slots).forEach(([name, slot]) => {
        const originSlot = template.slots![name]
        if (isString(originSlot))
          template.slots![name] = slot
        else if (isTemplate(originSlot) && isTemplate(slot))
          patchTemplateComponentAndAttrs(originSlot, slot)
        else
          template.slots![name] = slot
      })
    }
  }

  return {
    template,
    open,
    close,
    patchTemplate,
    destroy: () => hide(),
  }
}

function withMarkRaw<T extends Component>(template: Partial<UseModalTemplate<T>>, DefaultComponent: Component = VueFinalModal) {
  const { component, slots: innerSlots, ...rest } = template

  const slots: UseModalTemplate<T>['slots'] = typeof innerSlots === 'undefined'
    ? {}
    : Object.fromEntries(objectEntries(innerSlots).map(([name, maybeComponent]) => {
      if (isString(maybeComponent))
        return [name, maybeComponent] as const

      if (isTemplate(maybeComponent)) {
        return [name, {
          ...maybeComponent,
          component: markRaw(maybeComponent.component),
        }]
      }

      return [name, markRaw(maybeComponent as Component)]
    })) as UseModalTemplate<T>['slots']

  return {
    ...rest,
    component: markRaw(component || DefaultComponent),
    slots,
  }
}

function patchTemplateComponentAndAttrs<T extends Component>(
  template: UseModalTemplate<T> | Template<Component>,
  newTemplate: Partial<UseModalTemplate<T>> | Template<Component>,
) {
  if (newTemplate.component)
    template.component = newTemplate.component

  if (newTemplate.attrs)
    patchAttrs(template.attrs!, newTemplate.attrs)
}

function patchAttrs<T extends Record<string, any>>(attrs: T, newAttrs: Partial<T>): T {
  Object.entries(newAttrs).forEach(([key, value]) => {
    attrs[key as keyof T] = value as any
  })

  return attrs
}
