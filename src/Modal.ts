import type VueFinalModal from './components/VueFinalModal.vue'

export interface UseModalOptions {
  value?: boolean
  component?: InstanceType<typeof VueFinalModal>
  id?: Symbol
  bind?: Record<string, any>
  slots?: Record<string, any>
  on?: Record<string, any>

  reject?: (reason?: string) => void
  opened?: () => void
  rejectClose?: (reason?: string) => void
  closed?: () => void
}

export interface Modal {
  uid: string
  props: {
    name?: string
  }
  emit: any
  vfmContainer: any
  vfmContent: any
  vfmResize: any
  vfmOverlayTransition: any
  vfmTransition: any
  modalStackIndex: any
  visibility: any
  handleLockScroll: any
  toggle: (show?: boolean) => Promise<string>
}
