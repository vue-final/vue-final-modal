import { inject } from 'vue'
import { vfmSymbol } from './injectionSymbols'
import type { Vfm } from './Modal'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside
 * templates.
 */
export function useVfm(): Vfm {
  return inject(vfmSymbol)!
}
