import type { InjectionKey } from 'vue'
import type { Vfm } from './types'

export const vfmSymbol = Symbol('vfm') as InjectionKey<Vfm>
