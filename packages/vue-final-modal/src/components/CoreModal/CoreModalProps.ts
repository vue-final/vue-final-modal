import type { Options } from 'focus-trap'
import type { PropType, TransitionProps } from 'vue'
import type { ModalId, StyleValue } from '~/Modal'

export interface CoreModalProps {
  /** @description An uniq name for the open/close a modal via vfm.open/vfm.close APIs. */
  modalId?: ModalId
  /**
   * @description Display the modal or not.
   * @defaultValue `undefined`
   */
  modelValue?: boolean
  /**
   * @description Render the modal via `if` or `show`.
   * @defaultValue `'show'`
   */
  displayDirective?: 'if' | 'show'
  /** @description Hide the overlay or not. */
  hideOverlay?: boolean
  /**
   * @description Customize the content transition.
   * @defaultValue `'vfm'`
   */
  transition?: TransitionProps
  /**
   * @description Customize the overlay transition.
   * @defaultValue `'vfm'`
   */
  overlayTransition?: TransitionProps
  /** @description Bind class to vfm__overlay. */
  overlayClass?: any
  /** @description Bind class to vfm__content. */
  contentClass?: any
  /** @description Bind style to vfm__overlay. */
  overlayStyle?: StyleValue
  /** @description Bind style to vfm__content. */
  contentStyle?: StyleValue
  /**
   * @description Is it allow to close the modal by clicking the overlay.
   * @defaultValue `true`
   */
  clickToClose?: boolean
  /**
   * @description Is it allow to close the modal by keypress `esc`.
   * @defaultValue `true`
   */
  escToClose?: boolean
  /**
   * @description Is it allow to click outside of the vfm__content when the modal is opened
   * @defaultValue `'non-interactive'`
   */
  background?: 'interactive' | 'non-interactive'
  /**
   * @description
   * * Use `{ disabled: true }` to disable the focusTrap.
   * * Checkout the createOptions type here https://github.com/focus-trap/focus-trap for more.
   * @defaultValue `{ allowOutsideClick: true }`
   */
  focusTrap?: Options & { disabled?: true }
  /**
   * @description Lock body scroll or not when the modal is opened.
   * @defaultValue `true`
   */
  lockScroll?: boolean
  /**
   * @description
   * * Set specific number to z-index for current modal.
   * * If `undefined`, the zIndex will be calculated automatically.
   * @defaultValue `undefined`
   */
  zIndex?: number
  /**
   * @description The base number for auto calculating the z-index
   * @defaultValue `1000`
   */
  zIndexBase?: number
}

export const coreModalProps = {
  /**
   * @description An uniq name for the open/close a modal via vfm.open/vfm.close APIs.
   * @default `undefined`
   * @example Symbol: `Symbol('MyModal')`
   * @example String: `'AUniqString'`
   * @example Number: `300`
   */
  modalId: {
    type: [String, Number, Symbol] as PropType<ModalId>,
    default: undefined,
  },
  /**
   * @description Display the modal or not.
   * @default `undefined`
   * @example
   * ```js
   * const showModal = ref(false)
   * v-model="showModal"
   * ```
   */
  modelValue: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  /**
   * @description Render the modal via `if` or `show`.
   * @default `'show'`
   * @example
   * ```js
   * displayDirective: 'if'
   * ```
   * @example
   * ```js
   * displayDirective: 'show'
   * ```
   */
  displayDirective: {
    type: String as PropType<'if' | 'show'>,
    default: 'show',
    validator: (prop: any) => ['if', 'show'].includes(prop),
  },
  /**
   * @description Hide the overlay or not.
   * @default `undefined`
   * @example
   * ```js
   * hideOverlay="true"
   * ```
   */
  hideOverlay: {
    type: Boolean as PropType<boolean>,
    default: undefined,
  },
  /**
   * @description Customize the content transition.
   * @default `{ name: 'vfm' }`
   */
  transition: {
    type: Object as PropType<TransitionProps>,
    default: () => ({ name: 'vfm' }),
  },
  /**
   * @description Customize the overlay transition.
   * @default `{ name: 'vfm' }`
   */
  overlayTransition: {
    type: Object as PropType<TransitionProps>,
    default: () => ({ name: 'vfm' }),
  },
  /**
   * @description Bind class to vfm__overlay.
   * @default `undefined`
   */
  overlayClass: {
    type: undefined as unknown as PropType<any>,
    default: undefined,
  },
  /**
   * @description Bind class to vfm__content.
   * @default `undefined`
   */
  contentClass: {
    type: undefined as unknown as PropType<any>,
    default: undefined,
  },
  /**
   * @description Bind style to vfm__overlay.
   * @default `undefined`
   */
  overlayStyle: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: undefined,
  },
  /**
   * @description Bind style to vfm__content.
   * @default `undefined`
   */
  contentStyle: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: undefined,
  },
  /**
   * @description Is it allow to close the modal by clicking the overlay.
   * @default `true`
   */
  clickToClose: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * @description Is it allow to close the modal by keypress `esc`.
   * @default `true`
   */
  escToClose: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * @description Is it allow to click outside of the vfm__content when the modal is opened
   * @default `'non-interactive'`
   */
  background: {
    type: String as PropType<'interactive' | 'non-interactive'>,
    default: 'non-interactive',
    validator: (prop: any) => ['interactive', 'non-interactive'].includes(prop),
  },
  /**
   * @description
   * * Use `{ disabled: true }` to disable the focusTrap.
   * * Checkout the createOptions type here https://github.com/focus-trap/focus-trap for more.
   * @default `{ allowOutsideClick: true }`
   */
  focusTrap: {
    type: Object as PropType<Options & { disabled?: true }>,
    default: () => ({
      allowOutsideClick: true,
    }),
  },
  /**
   * @description Lock body scroll or not when the modal is opened.
   * @default `true`
   */
  lockScroll: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  /**
   * @description
   * * Set specific number to z-index for current modal.
   * * If `undefined`, the zIndex will be calculated automatically.
   * @default `undefined`
   */
  zIndex: {
    type: Number as PropType<number>,
    default: undefined,
  },
  /**
   * @description The base number for auto calculating the z-index
   * @default `1000`
   */
  zIndexBase: {
    type: Number as PropType<number>,
    default: 1000,
  },
} as const
