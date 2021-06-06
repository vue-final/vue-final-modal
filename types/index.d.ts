import Vue, { PluginObject, VNodeData, Component, AsyncComponent } from 'vue'
import './lib'

export class VueFinalModalComponant extends Vue {
  $refs: {
    vfmContainer: HTMLDivElement
  }
}

export interface DynamicModalOptions {
  /**
   * modal component
   */
  component?: string | Component | AsyncComponent
  /**
   * bind props and attrs to modal
   */
  bind?: { [key: string]: any }
  /**
   * register events to modal
   */
  on?: VNodeData['on']
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
          component: string | Component | AsyncComponent
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

export interface VueFinalModalProperty {
  readonly dynamicModals: DynamicModalData[]
  readonly openedModals: VueFinalModalComponant[]
  readonly modals: VueFinalModalComponant[]
  get(...names: string[]): VueFinalModalComponant[]

  show(name: string, params?: any): void
  show(modal: DynamicModalOptions, params?: any): void

  hide(...names: string[]): void
  hideAll(): void

  toggle(name: string | string[], params?: any): void
  toggle(name: string | string[], show?: boolean, params?: any): void
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $vfm: VueFinalModalProperty
  }
}

export interface VfmOptions {
  key?: string
  componentName?: string
  dynamicContainerName?: string
}

declare const VfmPlugin: () => PluginObject<VfmOptions>

export default VfmPlugin
