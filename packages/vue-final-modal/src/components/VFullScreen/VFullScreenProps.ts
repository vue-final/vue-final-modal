import type { PropType } from 'vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'
import type { StyleValue } from '~/Modal'

export const vFullScreenModalProps = {
  ...vueFinalModalProps,
  /**
   * @description Hide the overlay or not.
   * @default `true`
   * @example
   * ```js
   * hideOverlay="false"
   * ```
   */
  hideOverlay: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * @description Bind class to `vfm-full-screen-content`.
   * @default `undefined`
   */
  fullScreenClass: {
    type: undefined as unknown as PropType<any>,
    default: undefined,
  },
  /**
   * @description Bind style to `vfm-full-screen-content`.
   * @default `undefined`
   */
  fullScreenStyle: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: undefined,
  },
  /**
   * @description The direction of swiping to close the full screen modal
   * @default `none`
   * @example
   * Set closeDirection="RIGHT" to enable swiping right to close
   * ```js
   * closeDirection="RIGHT"
   * ```
   */
  closeDirection: {
    type: String as PropType<'none' | 'RIGHT' | 'LEFT'>,
    default: 'none',
    validator: (prop: any) => ['none', 'RIGHT', 'LEFT'].includes(prop),
  },
  /**
   * @description Threshold for swipe to close
   * @default `30`
   */
  threshold: {
    type: Number as PropType<number>,
    default: 30,
  },
  /**
   * @description If set `:showSwipeBanner="true"`, only allow clicking `swipe-banner` slot to swipe to close
   * @default `undefined`
   * @example
   * ```js
   * closeDirection="RIGHT"
   * :showSwipeBanner="true"
   * ```
   * ```html
   * <VFullScreen
   *   ...
   *   closeDirection="RIGHT"
   *   :showSwipeBanner="true"
   * >
   *   <template #swipe-banner>
   *     <div style="position: absolute; height: 100%; top: 0; left: 0; width: 10px;" />
   *   </template>
   *   ...modal content
   * </VFullScreen>
   * ```
   */
  showSwipeBanner: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  /**
   * @description When set `:preventNavigationGestures="true"`, there will be two invisible bars for prevent navigation gestures including swiping back/forward on mobile webkit. For example: Safari mobile.
   * @default `undefined`
   * @example
   * Set preventNavigationGestures="true" to prevent Safari navigation gestures including swiping back/forward.
   * ```js
   * :preventNavigationGestures="true"
   * ```
   */
  preventNavigationGestures: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
} as const
