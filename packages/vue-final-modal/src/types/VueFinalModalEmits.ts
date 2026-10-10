export interface VueFinalModalEmits {
  (e: 'update:modelValue', modelValue: boolean): void

  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}
