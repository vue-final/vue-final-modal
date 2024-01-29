import type { App, ComputedRef } from 'vue'
import { getCurrentInstance, inject, markRaw, ref, shallowReactive } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import type { ModalExposed, ModalId, Vfm } from './Modal'
import { noop } from './utils'
import { useVNodesContainer } from './useVNodesContainer'

// eslint-disable-next-line import/no-mutable-exports
export let activeVfm: Vfm | undefined

export const setActiveVfm = (vfm: Vfm | undefined) =>
  (activeVfm = vfm)

export const defaultVfm: Vfm = {
  install: noop,
  modals: [],
  openedModals: [],
  openedModalOverlays: [],
  vNodesContainer: {
    vNodes: [],
    containers: ref([]),
    push: noop,
    remove: noop,
  },
  get: () => undefined,
  toggle: () => undefined,
  open: () => undefined,
  close: () => undefined,
  closeAll: () => Promise.allSettled([]),
}

export const getActiveVfm = () =>
  (getCurrentInstance() && inject(vfmSymbol, defaultVfm)) || activeVfm

export function createVfm() {
  const modals: ComputedRef<ModalExposed>[] = shallowReactive([])
  const openedModals: ComputedRef<ModalExposed>[] = shallowReactive([])
  const openedModalOverlays: ComputedRef<ModalExposed>[] = shallowReactive([])

  const vfm: Vfm = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm
    },
    modals,
    openedModals,
    openedModalOverlays,
    vNodesContainer: useVNodesContainer(),
    get(modalId: ModalId) {
      return modals.find(modal => modal.value?.modalId?.value === modalId)
    },
    toggle(modalId: ModalId, show?: boolean) {
      const modal = vfm.get(modalId)
      return modal?.value?.toggle(show)
    },
    open(modalId: ModalId) {
      return vfm.toggle(modalId, true)
    },
    close(modalId: ModalId) {
      return vfm.toggle(modalId, false)
    },
    closeAll() {
      return Promise.allSettled(openedModals
        .reduce<Promise<string>[]>((acc, cur) => {
          const promise = cur.value?.toggle(false)
          if (promise)
            acc.push(promise)
          return acc
        }, []),
      )
    },
  })

  setActiveVfm(vfm)

  return vfm
}
