import type { PropType } from 'vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'

export const vBottomSheetProps = {
  ...vueFinalModalProps,
  /**
   * @description The direction of swiping to close the bottom sheet modal
   * @default `DOWN`
   * @example
   * Set closeDirection="none" to disable swiping to close
   * ```js
   * closeDirection="none"
   * ```
   */
  closeDirection: {
    type: String as PropType<'NONE' | 'DOWN'>,
    default: 'DOWN',
    validator: (prop: any) => ['NONE', 'DOWN'].includes(prop),
  },
  /**
   * @description Threshold for swipe to close
   * @default `0`
   */
  threshold: {
    type: Number as PropType<number>,
    default: 0,
  },
} as const
