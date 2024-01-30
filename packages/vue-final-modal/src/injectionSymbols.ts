import type { InjectionKey } from 'vue'
import type { Vfm } from './types'

export const vfmSymbol = Symbol(__DEV__ ? 'vfm' : '') as InjectionKey<Vfm>
