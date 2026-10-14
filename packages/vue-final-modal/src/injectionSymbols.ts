import type { InjectionKey } from 'vue'
import type { ModalContext } from './composables/useModalContext'
import type { Vfm } from './types'

export const vfmSymbol = Symbol('vfm') as InjectionKey<Vfm>
export const modalContextKey = Symbol('vfm-modal-context') as InjectionKey<ModalContext>
