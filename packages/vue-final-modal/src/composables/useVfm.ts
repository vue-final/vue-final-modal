import type { Vfm } from '../types'
import { vfmResolver } from '../plugin'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside templates.
 */
export function useVfm(): Vfm {
  const vfm = vfmResolver.resolve()
  if (!vfm) {
    throw new Error(
      '[Vue Final Modal]: useVfm was called with no active Vfm. Did you forget to install vfm?\n'
      + '\tconst vfm = createVfm()\n'
      + '\tapp.use(vfm)',
    )
  }

  return vfm
}
