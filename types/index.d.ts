import { App, Ref, SetupContext, EmitsOptions, ComponentPublicInstance, Component } from 'vue'

export interface VfmOptions {
  key?: string
  componentName?: string
  dynamicContainerName?: string
}

type VueFinalModal = (options?: VfmOptions) => {
  install(app: App, options?: VfmOptions): void
}

interface VueFinalModalInfo {
  uid: symbol
  name: string
  emit: SetupContext<EmitsOptions>
  getAttachElement(): false | HTMLElement
  modalStackIndex: Ref<number | null>
  visibility: {
    modal: boolean
    overlay: boolean
  }
  handleLockScroll(): void
  hideOverlay: boolean
  focusTrap: boolean
}

export interface DynamicModalOptions {
  /**
   * modal component
   */
  component?: string | Component
  /**
   * bind props and attrs to modal
   */
  bind?: { [key: string]: any }
  /**
   * register events to modal
   */
  on?: { [key: string]: Function | Function[] }
  /**
   * modal component slot
   *
   * @example
   * ```js
   * {
   *   slot: {
   *     default: {
   *       component: 'RegistedComponentName'
   *       bind: {
   *         yourPropsKey: propsValue
   *       }
   *     }
   *   }
   * }
   * ```
   *
   * @example
   * ```js
   * {
   *   slot: {
   *     default: 'pure string'
   *   }
   * }
   * ```
   */
  slots?: {
    [key: string]:
      | {
          component: string | Component
          bind?: { [key: string]: any }
          on?: { [key: string]: Function | Function[] }
        }
      | string
  }
}

interface DynamicModalData extends DynamicModalOptions {
  value: boolean
  id: symbol
  params: any
}

export interface VueFinalModalComponent extends ComponentPublicInstance {
  vfmContainer: HTMLDivElement
}

export interface VueFinalModalProperty {
  readonly dynamicModals: DynamicModalData[]
  readonly openedModals: VueFinalModalInfo[]
  readonly modals: VueFinalModalInfo[]

  get(...names: string[]): VueFinalModalInfo[]

  show(name: string, params?: any): Promise<void>
  show(modal: DynamicModalOptions, params?: any): Promise<void>

  hide(...names: string[]): Promise<void>
  hideAll(): Promise<void>

  toggle(name: string | string[], params?: any): Promise<void>
  toggle(name: string | string[], show?: boolean, params?: any): Promise<void>
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $vfm: VueFinalModalProperty
  }
}

export const $vfm: VueFinalModalProperty;

export const vfmPlugin: VueFinalModal
