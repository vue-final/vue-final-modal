import type { PropType, RendererElement } from 'vue'

export const vueFinalModalProps = {
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
