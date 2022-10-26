import type { App, ComputedRef } from 'vue'
import { markRaw, nextTick, reactive, ref, shallowReactive } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import type { ComponentProps, Modal, ModalId, UseModalOptions, UseModalOptionsPrivate, UseModalReturnType, Vfm } from './Modal'

export function createVfm() {
  const modals: ComputedRef<Modal>[] = []
  const openedModals: ComputedRef<Modal>[] = []
  const dynamicModals: UseModalOptionsPrivate<{}, {}>[] = shallowReactive([])
  const modalsContainers = ref<symbol[]>([])

  function existModal<ModalProps extends ComponentProps, DefaultSlotProps extends ComponentProps>(options: UseModalOptionsPrivate<ModalProps, DefaultSlotProps>) {
    return dynamicModals.includes(options)
  }

  function useModal<
    ModalProps extends ComponentProps,
    DefaultSlotProps extends ComponentProps = ComponentProps,
  >(_options?: UseModalOptions<ModalProps, DefaultSlotProps>): UseModalReturnType<ModalProps, DefaultSlotProps> {
    const options = reactive({
      id: Symbol('useModal'),
      modelValue: false,
      ..._options,
    }) as UseModalOptionsPrivate<ModalProps, DefaultSlotProps>

    const open = () => {
      options.modelValue = true
      return existModal(options)
        ? Promise.resolve('[Vue Final Modal] modal is already opened')
        : new Promise((resolve) => {
          options.resolveOpened = () => resolve('opened')
          dynamicModals.push(options)
        })
    }

    const close = () => {
      options.modelValue = false
      return existModal(options)
        ? new Promise((resolve) => {
          options.resolveClosed = () => resolve('closed')
        })
        : Promise.resolve('[Vue Final Modal] modal is already closed')
    }

    const mergeOptions = (_options: UseModalOptions<ModalProps, DefaultSlotProps>) => {
      Object.assign(options?.attrs || {}, _options?.attrs || {})
      Object.assign(options?.component || {}, _options?.component || {})
      Object.assign(options?.slots || {}, _options?.slots || {})
    }

    return {
      open,
      close,
      options,
      mergeOptions,
    }
  }

  const vfm: Vfm = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm
    },
    modals,
    openedModals,
    dynamicModals,
    modalsContainers,
    get(modalId: ModalId) {
      return modals.find(modal => modal.value.modalId && modalId === modal.value.modalId)
    },
    toggle(modalId: ModalId, show?: boolean) {
      const modal = vfm.get(modalId)
      return modal?.value.toggle(show)
    },
    open(modalId: ModalId) {
      return vfm.toggle(modalId, true)
    },
    close(modalId: ModalId) {
      return vfm.toggle(modalId, false)
    },
    closeAll() {
      return Promise.allSettled([openedModals.map(modal => modal.value.toggle(false))])
    },
    deleteFromModals(modal: ComputedRef<Modal>) {
      const index = modals.findIndex(_modal => _modal.value === modal.value)
      if (index !== -1)
        modals.splice(index, 1)
    },
    moveToLastOpenedModals(modal: ComputedRef<Modal>) {
      vfm.deleteFromOpenedModals(modal)
      openedModals.push(modal)
    },
    deleteFromOpenedModals(modal: ComputedRef<Modal>) {
      const index = openedModals.findIndex(_modal => _modal.value === modal.value)
      if (index !== -1)
        openedModals.splice(index, 1)
    },
    async openLastOverlay() {
      await nextTick()
      // Close all overlay first
      openedModals.forEach(modal => modal.value.overlayVisible.value = false)
      // Open the last overlay if it has overlay
      if (openedModals.length > 0) {
        const modal = openedModals[openedModals.length - 1]
        !modal.value.hideOverlay?.value && (modal.value.overlayVisible.value = true)
      }
    },
    resolvedClosed(index: number) {
      dynamicModals[index].resolveClosed?.()
      dynamicModals.splice(index, 1)
    },
    resolvedOpened(index: number) {
      dynamicModals[index].resolveOpened?.()
    },
    useModal,
  })

  return vfm
}
