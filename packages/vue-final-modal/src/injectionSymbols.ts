import type { InjectionKey } from 'vue'
import type { InternalVfm, Vfm } from './Modal'

export const vfmSymbol = Symbol(__DEV__ ? 'vfm' : '') as InjectionKey<Vfm>
export const internalVfmSymbol = Symbol(__DEV__ ? 'internalVfm' : '') as InjectionKey<InternalVfm>
