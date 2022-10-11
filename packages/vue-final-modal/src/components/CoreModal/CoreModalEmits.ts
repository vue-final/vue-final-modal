import type CoreModal from '../CoreModal/CoreModal.vue'

export function useEmits(emit: InstanceType<typeof CoreModal>['$emit']) {
  return {
    'onUpdate:modelValue': (val: boolean) => emit('update:modelValue', val),

    'onBeforeClose': () => emit('beforeClose'),
    'onClosed': () => emit('closed'),
    'onBeforeOpen': () => emit('beforeOpen'),
    'onOpened': () => emit('opened'),
    'onClickOutside': () => emit('clickOutside'),

    'onInternalBeforeClose': () => emit('internalBeforeClose'),
    'onInternalClosed': () => emit('internalClosed'),
    'onInternalBeforeOpen': () => emit('internalBeforeOpen'),
    'onInternalOpened': () => emit('internalOpened'),
  }
}
