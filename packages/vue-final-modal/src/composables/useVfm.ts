import type { Vfm } from '../types'
import { missingVfmError, vfmResolver } from '../plugin'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside templates.
 */
export function useVfm(): Vfm {
  const vfm = vfmResolver.resolve()
  if (!vfm)
    throw missingVfmError()
  return vfm
}
