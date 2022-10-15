import type { PropType, RendererElement } from 'vue'
import { coreModalProps } from '../CoreModal/CoreModalProps'

export const vueFinalModalProps = {
  ...coreModalProps,
  /**
   * @description Set `null | false` to disable teleport.
   * @default `'body'`
   * @example
   * ```js
   * teleportTo: '#modals'
   * ```
   */
  teleportTo: {
    type: [String, null, Boolean, Object] as PropType<string | RendererElement | null | false>,
    default: 'body',
  },
} as const
