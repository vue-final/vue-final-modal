import type { PropType } from 'vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'
import type { StyleValue } from '~/Modal'

export const vBottomSheetProps = {
  ...vueFinalModalProps,
  /**
   * @description Bind class to `vfm-bottom-sheet-content`.
   * @default `undefined`
   */
  bottomSheetClass: {
    type: undefined as unknown as PropType<any>,
    default: undefined,
  },
  /**
   * @description Bind style to `vfm-bottom-sheet-content`.
   * @default `undefined`
   */
  bottomSheetStyle: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: undefined,
  },
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
    type: String as PropType<'none' | 'DOWN'>,
    default: 'DOWN',
    validator: (prop: any) => ['none', 'DOWN'].includes(prop),
  },
  /**
   * @description Threshold for swipe to close
   * @default `30`
   */
  threshold: {
    type: Number as PropType<number>,
    default: 30,
  },
} as const
