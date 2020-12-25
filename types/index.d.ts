import Vue, { PluginObject } from 'vue'
import './lib'

export class VueFinalModalComponant extends Vue {
  $refs: {
    vfmContainer: HTMLDivElement,
    vfmContent: HTMLDivElement
  }
}

export type VueFinalModalCore = {
  readonly openedModals: VueFinalModalComponant[]
  readonly modals: VueFinalModalComponant[],
  get(name: string): VueFinalModalComponant | undefined
  show(name: string): void
  hide(name: string): void
  hideAll(): void
  toggle(name: string, params?: any): void
  toggle(name: string, show?: boolean, params?: any): void
}


declare module 'vue/types/vue' {
  interface Vue {
    readonly $vfm: VueFinalModalCore
  }
}

export interface VfmOptions {
  componentName: string,
  key: string
}

declare const VfmPlugin: () => PluginObject<VfmOptions>

export default VfmPlugin