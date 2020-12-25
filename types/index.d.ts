import {
  App,
  Ref,
  SetupContext,
  EmitsOptions,
  ComponentPublicInstance
} from 'vue'

export interface VfmOptions {
  componentName: string,
  key: string
}

type VueFinalModal = () => {
  install(app: App, options: VfmOptions): void
}

interface VueFinalModalInfo {
  uid: symbol
  name: string
  emit: SetupContext<EmitsOptions>
  vfmContent: Ref<HTMLDivElement>
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

export type VueFinalModalComponent = ComponentPublicInstance & {
  vfmContainer: HTMLDivElement,
  vfmContent: HTMLDivElement
}

export type VueFinalModalProperty = {
  openedModals: VueFinalModalInfo[]
  modals: VueFinalModalInfo[]
  get(name: string): VueFinalModalInfo | undefined
  show(name: string): void
  hide(name: string): void
  hideAll(): void
  toggle(name: string, show: boolean): void
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    readonly $vfm: VueFinalModalProperty
  }
}

declare const VueFinalModal: VueFinalModal
export default VueFinalModal
