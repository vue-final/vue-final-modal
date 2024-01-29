import type { VNode } from 'vue'
import { nextTick } from 'vue'
import type { Vfm } from './Modal'
import { activeVfm, getActiveVfm } from './plugin'

/**
 * Returns the vfm instance. Equivalent to using `$vfm` inside
 * templates.
 */
export function useVfm(): Vfm {
  const vfm = getActiveVfm()
  if (__DEV__ && !vfm) {
    throw new Error(
      '[Vue Final Modal]: getActiveVfm was called with no active Vfm. Did you forget to install vfm?\n'
      + '\tconst vfm = createVfm()\n'
      + '\tapp.use(vfm)\n'
      + 'This will fail in production.',
    )
  }

  return vfm!
}

/** nextTick will break the SSR, so use `activeVfm` first and then `useVfm()` */
export async function useSsrVfm(): Promise<Vfm> {
  if (activeVfm) {
    return activeVfm
  }
  else {
    await nextTick()
    return useVfm()
  }
}

export async function pushVNode(vNode: VNode) {
  const vfm = await useSsrVfm()
  vfm.vNodesContainer.push(vNode)
}

export function removeVNode(vNode: VNode): void {
  const vfm = useVfm()
  vfm.vNodesContainer.remove(vNode)
}