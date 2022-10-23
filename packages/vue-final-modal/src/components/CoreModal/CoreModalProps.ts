import type { Options } from 'focus-trap'
import type { PropType, TransitionProps } from 'vue'
import type { ModalId, StyleValue } from '~/Modal'

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
   * @default `'if'`
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
    default: 'if',
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
   * @description Customize the overlay transition.
   * @default `{ name: 'vfm' }`
   */
  overlayTransition: {
    type: Object as PropType<TransitionProps>,
    default: () => ({ name: 'vfm' }),
  },
  /**
   * @description Customize the content transition.
   * @default `{ name: 'vfm' }`
   */
  contentTransition: {
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
   * @description Define how to increase the zIndex when there are nested modals
   * @default `({ index }) => 1000 + 2 * index`
   */
  zIndexFn: {
    type: Function as PropType<(context: { index: number }) => number | undefined>,
    default: ({ index }: { index: number }) => 1000 + 2 * index,
  },
} as const
