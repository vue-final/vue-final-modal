import type { App, Component, ComputedRef, Ref } from 'vue'
import { markRaw, ref, shallowReactive } from 'vue'
import type { TemplateState } from 'vue-use-template'
import { createInstanceResolver, createProvider, createTemplateOutlet } from 'vue-use-template'
import { vfmSymbol } from './injectionSymbols'
import type { ModalExposed, ModalId, Vfm } from './types'

export interface VfmInternal extends Vfm {
  _templates: TemplateState
  _TemplateOutlet: Component
  _containers: Ref<symbol[]>
}

export const vfmResolver = /* @__PURE__ */ createInstanceResolver(vfmSymbol)

export function createVfm(): Vfm {
  const vfm = createVfmInstance()
  vfmResolver.setActive(vfm)
  return vfm
}

export function createVfmInstance(): VfmInternal {
  const modals: ComputedRef<ModalExposed>[] = shallowReactive([])
  const openedModals: ComputedRef<ModalExposed>[] = shallowReactive([])
  const openedModalOverlays: ComputedRef<ModalExposed>[] = shallowReactive([])
  /** A vfm belongs to one app, so one request on the server: one set of templates, also usable before the render starts (route middleware, plugins). */
  const provider = createProvider()
  const templates: TemplateState = {
    install() {},
    resolveProvider: () => provider,
  }

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
    _templates: templates,
    _TemplateOutlet: createTemplateOutlet(templates),
    _containers: ref<symbol[]>([]),
  })

  return vfm
}
