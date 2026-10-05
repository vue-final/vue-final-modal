import type { Component } from 'vue'
import { defineComponent, h, provide } from 'vue'
import type { UseModalOptions, UseModalReturnType, Vfm } from './types'
import { vfmSymbol } from './injectionSymbols'
import { createVfmInstance } from './plugin'
import { useModalImpl } from './composables/useModal'
import { ModalsContainer } from './components/ModalsContainer'

/**
 * Advanced API: creates an isolated vfm instance for multi-app or multi-provider usage.
 * Most apps should use `createVfm()` + `<ModalsContainer />` instead.
 */
export function createModalsProvider() {
  const vfm = createVfmInstance()

  const ModalsProvider = defineComponent({
    name: 'ModalsProvider',
    setup(_props, { slots }) {
      provide(vfmSymbol, vfm)
      return () => [slots.default?.(), h(ModalsContainer)]
    },
  })

  function useModal<T extends Component>(options: UseModalOptions<T>): UseModalReturnType {
    return useModalImpl(options, () => vfm)
  }

  function useVfm(): Vfm {
    return vfm
  }

  return {
    ModalsProvider,
    useModal,
    useVfm,
  }
}
