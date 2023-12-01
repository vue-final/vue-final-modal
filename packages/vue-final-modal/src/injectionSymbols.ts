import type { InjectionKey } from 'vue'
import type { Vfm } from './Modal'

export const vfmSymbol = Symbol(__DEV__ ? 'vfm' : '') as InjectionKey<Vfm>
