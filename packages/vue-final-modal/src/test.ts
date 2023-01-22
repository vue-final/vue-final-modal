import {
  reactive,
} from 'vue'
import type {
  App,
  ComponentOptions,
  ComputedRef,
  ConcreteComponent,
  Ref,
  VNodeProps,
} from 'vue'
import type { Modal, ModalId } from './index'
import { ModalFullscreen, VueFinalModal } from './index'

type RawProps = VNodeProps & {
  // used to differ from a single VNode object as children
  __v_isVNode?: never
  // used to differ from Array children
  [Symbol.iterator]?: never
} & Record<string, any>

type Attrs<P> = (RawProps & P) | ({} extends P ? null : never)

type ModalSlot<P> = {
  component: ConcreteComponent<P>
  attrs?: Attrs<P>
} | {
  component: ComponentOptions<P>
  attrs?: Attrs<P>
}

type UseModalOptionsBase<P, SP> = {
  attrs?: Attrs<P>
  slots?: {
    default: ModalSlot<SP>
    [key: string]: ModalSlot<SP>
  }
}

type UseModalOptionsA<P, SP> = {
  component: ConcreteComponent<P>
} & UseModalOptionsBase<P, SP>

type UseModalOptionsB<P, SP> = {
  component: ComponentOptions<P>
} & UseModalOptionsBase<P, SP>

type UseModalOptions = {
  defaultModelValue?: boolean
  context?: Vfm
  component: any
  attrs?: any
  slots?: any
}

type UseModalOptionsPrivate = UseModalOptions & {
  id: symbol
  modelValue: boolean
  resolveOpened: () => void
  resolveClosed: () => void
}
// interface UseModalReturnTypeA {
//   options: UseModalOptionsPrivate
//   open: () => Promise<string>
//   close: () => Promise<string>
//   patchOptions<P, SP>(options: UseModalOptionsA<P, SP>): void
//   patchOptions<P, SP>(options: UseModalOptionsB<P, SP>): void
//   destroy: () => void
// }
// interface UseModalReturnTypeB {
//   options: UseModalOptionsPrivate
//   open: () => Promise<string>
//   close: () => Promise<string>
//   patchOptions<P, SP>(options: UseModalOptionsA<P, SP>): void
//   patchOptions<P, SP>(options: UseModalOptionsB<P, SP>): void
//   destroy: () => void
// }

interface UseModalReturnType {
  options: UseModalOptionsPrivate
  open: () => Promise<string>
  close: () => Promise<string>
  patchOptions<P, SP>(options: UseModalOptionsA<P, SP>): void
  patchOptions<P, SP>(options: UseModalOptionsB<P, SP>): void
  destroy: () => void
}

type Vfm = {
  install(app: App): void
  modals: ComputedRef<Modal>[]
  openedModals: ComputedRef<Modal>[]
  dynamicModals: UseModalOptionsPrivate[]
  modalsContainers: Ref<symbol[]>
  get: (modalId: ModalId) => undefined | ComputedRef<Modal>
  toggle: (modalId: ModalId, show?: boolean) => undefined | Promise<string>
  open: (modalId: ModalId) => undefined | Promise<string>
  close: (modalId: ModalId) => undefined | Promise<string>
  closeAll: () => Promise<[PromiseSettledResult<Promise<string>[]>]>
}

export function defineModal<P, SP>(options: UseModalOptionsA<P, SP>): UseModalReturnType
export function defineModal<P, SP>(options: UseModalOptionsB<P, SP>): UseModalReturnType
export function defineModal(_options: UseModalOptions): UseModalReturnType {
  const options = reactive<UseModalOptionsPrivate>({
    id: Symbol('useModal'),
    modelValue: !!_options?.defaultModelValue,
    resolveOpened: () => {},
    resolveClosed: () => {},
    attrs: {},
    ..._options,
  })

  // if (!options.context)
  //   options.context = useVfm()

  function open(): Promise<string> {
    if (options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already opened')

    options.modelValue = true
    return new Promise((resolve) => {
      options.resolveOpened = () => resolve('opened')
    })
  }

  function close(): Promise<string> {
    if (!options.modelValue)
      return Promise.resolve('[Vue Final Modal] modal is already closed')

    options.modelValue = false
    return new Promise((resolve) => {
      options.resolveClosed = () => resolve('closed')
    })
  }

  // function patchOptions<P, SP>(options: UseModalOptionsA<P, SP>): void
  // function patchOptions<P, SP>(options: UseModalOptionsB<P, SP>): void
  function patchOptions(_options: Partial<UseModalOptions>) {
    const _patchOptions = _options
    if (_patchOptions?.attrs)
      Object.assign(options.attrs || {}, _patchOptions.attrs)
    if (_patchOptions?.component)
      Object.assign(options.component || {}, _patchOptions.component)
    if (_patchOptions?.slots)
      Object.assign(options.slots || {}, _patchOptions.slots)
  }

  function destroy(): void {
    if (!options.context)
      return
    const index = options.context.dynamicModals.indexOf(options)
    if (index !== -1)
      options.context.dynamicModals.splice(index, 1)
  }

  return {
    options,
    open,
    close,
    patchOptions,
    destroy,
  } as UseModalReturnType
}

const modal = defineModal({
  component: VueFinalModal,
  attrs: {
    background: 'interactive',
    clickToClose: true,
  },

  slots: {
    default: {
      component: ModalFullscreen,
      attrs: {
        escToClose: '123',
      },
    },
  },
})

// modal.patchOptions({
//   component: ModalFullscreen,
//   attrs: {

//   },
// })
