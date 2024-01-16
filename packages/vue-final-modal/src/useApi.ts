import type { Component, VNode } from 'vue'
import { computed, h, markRaw, nextTick, reactive, useAttrs } from 'vue'
import { tryOnUnmounted } from '@vueuse/core'
import VueFinalModal from './components/VueFinalModal/VueFinalModal.vue'
import type { C2VOptions, UseModalOptions, UseModalOptionsPrivate, UseModalReturnType, Vfm } from './Modal'
import { activeVfm, getActiveVfm } from './plugin'
import type { ComponentEmit, ComponentProps, ComponentSlots } from './Component'
import { DynamicModal } from './components/DynamicModal'
import { isString, objectEntries } from '~/utils'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside
 * templates.
 */
export function useVfm(): Vfm {
  const vfm = getActiveVfm()
  if (__DEV__ && !vfm) {
    throw new Error(
      '[Vue Final Modal]: getActiveVfm was called with no active Vfm. Did you forget to install vfm?\n'
      + '\tconst vfm = createVfm()\n'
      + '\tapp.use(vfm)\n'
      + 'This will fail in production.',
    )
  }

  return vfm!
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

/**
 * Create a dynamic vNode.
 */
export function useC2v<T extends Component>(_options: C2VOptions<T>) {
  const id = Symbol(__DEV__ ? 'useC2v' : '')

  const vNode = h(_options.component, { key: id, ..._options.attrs }, _options.slots)

  tryOnUnmounted(() => {
    removeVNode(vNode)
  })

  return {
    open: () => pushVNode(vNode),
    close: () => removeVNode(vNode),
  }
}

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

async function pushVNode(vNode: VNode) {
  const vfm = await useSsrVfm()
  vfm.h.push(vNode)
}

/** nextTick will break the SSR, so use `activeVfm` first and then `useVfm()` */
async function useSsrVfm(): Promise<Vfm> {
  if (activeVfm) {
    return activeVfm
  }
  else {
    await nextTick()
    return useVfm()
  }
}

function removeVNode(vNode: VNode): void {
  const vfm = useVfm()
  vfm.h.remove(vNode)
}

export function isC2VOptions<T extends Component>(value: unknown): value is C2VOptions<T> {
  if (typeof value === 'object' && value !== null)
    return 'component' in value
  else
    return false
}

/** Convert Component Options to VNode */
export function c2v<T extends Component>(options: C2VOptions<T>) {
  return options
}

export function getSlots<T extends Component>(slots: {
  [K in keyof ComponentSlots<T>]?: string | Component | C2VOptions<Component>
}) {
  return objectEntries(slots || {}).reduce((acc, cur) => {
    const slotName = cur[0] as string
    const slot = cur[1] as string | Component | C2VOptions<any>
    if (isString(slot))
      acc[slotName] = () => h('div', { innerHTML: slot })
    else if (isC2VOptions(slot))
      acc[slotName] = () => h(slot.component, slot.attrs, slot.slots ? getSlots(slot.slots) : undefined)
    else
      acc[slotName] = () => h(slot)
    return acc
  }, {} as Record<string, () => VNode>)
}

export function pickModalProps(props: Record<string, any>, modalProps: Record<string, any>) {
  return Object.keys(modalProps).reduce<Record<string, any>>((acc, propName) => {
    acc[propName] = props?.[propName]
    return acc
  }, {})
}

export function byPassAllModalEvents(emit?: ComponentEmit<typeof VueFinalModal>): ComponentProps<typeof VueFinalModal> {
  return {
    'onUpdate:modelValue': (val: boolean) => emit?.('update:modelValue', val),

    'onBeforeClose': (payload: { stop: () => void }) => emit?.('beforeClose', payload),
    'onClosed': () => emit?.('closed'),
    'onBeforeOpen': (payload: { stop: () => void }) => emit?.('beforeOpen', payload),
    'onOpened': () => emit?.('opened'),

    /** onClickOutside will only be emitted when clickToClose equal to `false` */
    'onClickOutside': () => emit?.('clickOutside'),
  }
}

export function useVfmAttrs<TP extends Component, MP extends Component>(options: {
  props: ComponentProps<TP>
  modalProps: ComponentProps<MP>
  emit?: any
}) {
  const { props, modalProps, emit } = options
  const bindProps = computed(() => pickModalProps(props, modalProps))
  const bindEmits = byPassAllModalEvents(emit)
  const attrs = useAttrs()
  const vfmAttrs = computed(() => ({
    ...bindProps.value,
    ...bindEmits,
    ...attrs,
  }))

  return vfmAttrs
}
