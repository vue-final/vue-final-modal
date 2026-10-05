import type { App, ComputedRef, Ref, VNode } from 'vue'
import { getCurrentInstance, inject, markRaw, ref, shallowReactive } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import type { ModalExposed, ModalId, Vfm } from './types'
import { arrayRemoveItem } from './utils'

export interface VfmInternal extends Vfm {
  _vNodeFns: (() => VNode)[]
  _containers: Ref<symbol[]>
}

// eslint-disable-next-line import/no-mutable-exports
export let activeVfm: Vfm | undefined

export const setActiveVfm = (vfm: Vfm | undefined) =>
  (activeVfm = vfm)

export const getActiveVfm = (): Vfm | undefined =>
  (getCurrentInstance() && inject(vfmSymbol, undefined)) || activeVfm

export function createVfm(): Vfm {
  const vfm = createVfmInstance()
  setActiveVfm(vfm)
  return vfm
}

export function createVfmInstance(): VfmInternal {
  const modals: ComputedRef<ModalExposed>[] = shallowReactive([])
  const openedModals: ComputedRef<ModalExposed>[] = shallowReactive([])
  const openedModalOverlays: ComputedRef<ModalExposed>[] = shallowReactive([])

  const vfm: VfmInternal = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm
    },
    modals,
    openedModals,
    openedModalOverlays,
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
    _vNodeFns: shallowReactive([]),
    _containers: ref<symbol[]>([]),
  })

  return vfm
}

export function pushVNodeFn(vfm: Vfm, vNodeFn: () => VNode) {
  const { _vNodeFns } = vfm as VfmInternal
  if (!_vNodeFns.includes(vNodeFn))
    _vNodeFns.push(vNodeFn)
}

export function removeVNodeFn(vfm: Vfm, vNodeFn: () => VNode) {
  arrayRemoveItem((vfm as VfmInternal)._vNodeFns, vNodeFn)
}
