import './lib'
import Vue, { PluginObject } from 'vue'

export class VueFinalModalComponant extends Vue {
  $refs: {
    vfmContainer: HTMLDivElement,
    vfmContent: HTMLDivElement
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $vfm: {
      readonly openedModals: VueFinalModalComponant[]
      readonly modals: VueFinalModalComponant[]
      show(name: string): void
      hide(name: string): void
      hideAll(): void
      toggle(name: string, show: boolean): void
    }
  }
}

export interface VfmOptions {
  componentName: string,
  key: string
}

declare const VfmPlugin: () => PluginObject<VfmOptions>

export default VfmPlugin