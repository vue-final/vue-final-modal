import type { PropType } from 'vue'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'

export const modalFullscreenProps = {
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
   * @description The direction of swiping to close the full screen modal
   * @default `NONE`
   * @example
   * Set closeDirection="RIGHT" to enable swiping right to close
   * ```js
   * closeDirection="RIGHT"
   * ```
   */
  closeDirection: {
    type: String as PropType<'NONE' | 'RIGHT' | 'LEFT'>,
    default: 'NONE',
    validator: (prop: any) => ['NONE', 'RIGHT', 'LEFT'].includes(prop),
  },
  /**
   * @description Threshold for swipe to close
   * @default `0`
   */
  threshold: {
    type: Number as PropType<number>,
    default: 0,
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
   * <ModalFullscreen
   *   ...
   *   closeDirection="RIGHT"
   *   :showSwipeBanner="true"
   * >
   *   <template #swipe-banner>
   *     <div style="position: absolute; height: 100%; top: 0; left: 0; width: 10px;" />
   *   </template>
   *   ...modal content
   * </ModalFullscreen>
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
