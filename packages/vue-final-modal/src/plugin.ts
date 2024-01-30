import type { App, ComputedRef } from 'vue'
import { getCurrentInstance, inject, markRaw, shallowReactive } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import { noop } from './utils'
import { createContainer } from './createContainer'
import type { ModalExposed, ModalId, Vfm } from './types'

// eslint-disable-next-line import/no-mutable-exports
export let activeVfm: Vfm | undefined

export const setActiveVfm = (vfm: Vfm | undefined) =>
  (activeVfm = vfm)

export const defaultVfm: Vfm = {
  install: noop,
  modals: [],
  openedModals: [],
  openedModalOverlays: [],
  Container: undefined,
  useTemplate: undefined,
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

  const { Container, useTemplate } = createContainer()

  const vfm: Vfm = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm
    },
    modals,
    openedModals,
    openedModalOverlays,
    Container,
    useTemplate,
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
