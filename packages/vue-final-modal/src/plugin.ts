import type { App, ComputedRef } from 'vue'
import { getCurrentInstance, inject, markRaw, ref, shallowReactive } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import type { Modal, ModalId, UseModalOptions, UseModalOptionsPrivate, Vfm } from './Modal'
import { noop } from './utils'

// eslint-disable-next-line import/no-mutable-exports
export let activeVfm: Vfm | undefined

export const setActiveVfm = (vfm: Vfm | undefined) =>
  (activeVfm = vfm)

export const defaultVfm: Vfm = {
  install: noop,
  modals: [],
  openedModals: [],
  openedModalOverlays: [],
  dynamicModals: [],
  modalsContainers: ref([]),
  get: () => undefined,
  toggle: () => undefined,
  open: () => undefined,
  close: () => undefined,
  closeAll: () => Promise.allSettled([]),
}

export const getActiveVfm = () =>
  (getCurrentInstance() && inject(vfmSymbol, defaultVfm)) || activeVfm

export function createVfm() {
  const modals: ComputedRef<Modal>[] = shallowReactive([])
  const openedModals: ComputedRef<Modal>[] = shallowReactive([])
  const openedModalOverlays: ComputedRef<Modal>[] = shallowReactive([])
  const dynamicModals: (UseModalOptions<any> & UseModalOptionsPrivate)[] = shallowReactive([])
  const modalsContainers = ref<symbol[]>([])

  const vfm: Vfm = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm
    },
    modals,
    openedModals,
    openedModalOverlays,
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
      return Promise.allSettled(openedModals.map(modal => modal.value.toggle(false)))
    },
  })

  setActiveVfm(vfm)

  return vfm
}
