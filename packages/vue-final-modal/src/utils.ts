import type { CoreModalEmits } from './components/CoreModal/CoreModal.vue'

export const once
  = (fn: null | ((...args: any[]) => void)) =>
    (...args: any[]) => {
      if (!fn)
        return
      fn?.(...args)
      fn = null
    }

export const noop = () => {}

export function clamp(val: number, min: number, max: number) {
  return val > max ? max : val < min ? min : val
}

export function isString(str: any): str is string {
  return typeof str === 'string'
}

export function pickModalProps(props: any, modalProps: any) {
  return Object.keys(modalProps).reduce((acc, propName) => {
    acc[propName] = props[propName]
    return acc
  }, {} as Record<string, any>)
}

export function byPassAllModalEvents(emit: CoreModalEmits) {
  return {
    'onUpdate:modelValue': (val: boolean) => emit('update:modelValue', val),

    'onBeforeClose': () => emit('beforeClose'),
    'onClosed': () => emit('closed'),
    'onBeforeOpen': () => emit('beforeOpen'),
    'onOpened': () => emit('opened'),

    /** onClickOutside will only be emitted when clickToClose equal to `false` */
    'onClickOutside': () => emit('clickOutside'),
  }
}
