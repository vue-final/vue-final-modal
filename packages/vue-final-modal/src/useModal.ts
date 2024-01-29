import type { Component } from 'vue'
import { h, markRaw, reactive } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import { isString, objectEntries } from './utils'
import { DynamicModal } from './components/DynamicModal'
import { isC2VOptions } from './useC2v'
import { pushVNode, removeVNode } from './useVfm'
import type { C2VOptions, UseModalOptions, UseModalOptionsPrivate, UseModalReturnType } from '.'
import { VueFinalModal } from '.'

/**
 * Create a dynamic modal.
 */
export function useModal<T extends Component = typeof VueFinalModal>(_options: UseModalOptions<T>): UseModalReturnType<T> {
  const id = Symbol(__DEV__ ? 'useModal' : '')

  const options = reactive({
    id,
    modelValue: !!_options?.defaultModelValue,
    resolveOpened: () => { },
    resolveClosed: tryRemoveVNode,
    attrs: {},
    ...withMarkRaw<T>(_options),
  }) as UseModalOptions<T> & UseModalOptionsPrivate

  const vNode = h(DynamicModal, { modal: options, key: id })

  tryOnUnmounted(() => {
    tryRemoveVNode()
  })

  if (options.modelValue === true)
    pushVNode(vNode)

  function open(): Promise<string> {
    if (options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already opened.')

    tryRemoveVNode()
    options.modelValue = true
    pushVNode(vNode)

    return new Promise((resolve) => {
      options.resolveOpened = () => resolve('opened')
    })
  }

  function close(): Promise<string> {
    if (!options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already closed.')

    options.modelValue = false
    return new Promise((resolve) => {
      options.resolveClosed = () => {
        resolve('closed')
        tryRemoveVNode()
      }
    })
  }

  function tryRemoveVNode() {
    if (options.keepAlive)
      return
    removeVNode(vNode)
  }

  function patchOptions(_options: Partial<UseModalOptions<T>>) {
    const { slots, ...rest } = withMarkRaw(_options, options.component)

    if (_options.defaultModelValue !== undefined)
      options.defaultModelValue = _options.defaultModelValue
    if (_options?.keepAlive !== undefined)
      options.keepAlive = _options?.keepAlive

    // patch options.component and options.attrs
    patchComponentOptions(options, rest)

    // patch options.slots
    if (slots) {
      objectEntries(slots).forEach(([name, slot]) => {
        const originSlot = options.slots![name]
        if (isString(originSlot))
          options.slots![name] = slot
        else if (isC2VOptions(originSlot) && isC2VOptions(slot))
          patchComponentOptions(originSlot, slot)
        else
          options.slots![name] = slot
      })
    }
  }

  return {
    options,
    open,
    close,
    patchOptions,
    destroy: () => removeVNode(vNode),
  }
}

function withMarkRaw<T extends Component>(options: Partial<UseModalOptions<T>>, DefaultComponent: Component = VueFinalModal) {
  const { component, slots: innerSlots, ...rest } = options

  const slots: UseModalOptions<T>['slots'] = typeof innerSlots === 'undefined'
    ? {}
    : Object.fromEntries(objectEntries(innerSlots).map(([name, maybeComponent]) => {
      if (isString(maybeComponent))
        return [name, maybeComponent] as const

      if (isC2VOptions(maybeComponent)) {
        return [name, {
          ...maybeComponent,
          component: markRaw(maybeComponent.component),
        }]
      }

      return [name, markRaw(maybeComponent as Component)]
    })) as UseModalOptions<T>['slots']

  return {
    ...rest,
    component: markRaw(component || DefaultComponent),
    slots,
  }
}

function patchComponentOptions<T extends Component>(
  options: UseModalOptions<T> | C2VOptions<Component>,
  newOptions: Partial<UseModalOptions<T>> | C2VOptions<Component>,
) {
  if (newOptions.component)
    options.component = newOptions.component

  if (newOptions.attrs)
    patchAttrs(options.attrs!, newOptions.attrs)
}

function patchAttrs<T extends Record<string, any>>(attrs: T, newAttrs: Partial<T>): T {
  Object.entries(newAttrs).forEach(([key, value]) => {
    attrs[key as keyof T] = value as any
  })

  return attrs
}
