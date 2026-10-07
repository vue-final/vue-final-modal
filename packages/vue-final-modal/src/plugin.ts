import type { App, Component, ComputedRef, Ref } from 'vue'
import { markRaw, ref, shallowReactive } from 'vue'
import type { TemplateState } from 'vue-use-template'
import { createInstanceResolver, createTemplateOutlet, createTemplateState } from 'vue-use-template'
import { vfmSymbol } from './injectionSymbols'
import type { ModalExposed, Vfm } from './types'

export interface VfmInternal extends Vfm {
  _templates: TemplateState
  _TemplateOutlet: Component
  _containers: Ref<symbol[]>
}

export const vfmResolver = /* @__PURE__ */ createInstanceResolver(vfmSymbol)

export function missingVfmError() {
  return new Error(
    '[Vue Final Modal]: no active Vfm. Did you forget to install vfm?\n'
    + '\tconst vfm = createVfm()\n'
    + '\tapp.use(vfm)',
  )
}

export function createVfm(): Vfm {
  const vfm = createVfmInstance()
  vfmResolver.setActive(vfm)
  return vfm
}

export function createVfmInstance(): VfmInternal {
  const modals = shallowReactive<ComputedRef<ModalExposed>[]>([])
  const openedModals = shallowReactive<ComputedRef<ModalExposed>[]>([])
  const openedModalOverlays = shallowReactive<ComputedRef<ModalExposed>[]>([])
  const templates = createTemplateState()

  const vfm: VfmInternal = markRaw({
    install(app: App) {
      app.provide(vfmSymbol, vfm)
      app.config.globalProperties.$vfm = vfm
    },
    modals,
    openedModals,
    openedModalOverlays,
    get: modalId => modals.find(modal => modal.value.modalId.value === modalId),
    toggle: (modalId, show) => vfm.get(modalId)?.value.toggle(show),
    open: modalId => vfm.toggle(modalId, true),
    close: modalId => vfm.toggle(modalId, false),
    closeAll: () => Promise.allSettled(openedModals.map(modal => modal.value.toggle(false))),
    _templates: templates,
    _TemplateOutlet: createTemplateOutlet(templates),
    _containers: ref<symbol[]>([]),
  })

  return vfm
}
