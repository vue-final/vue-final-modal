import type { Component } from 'vue'
import { computed, useAttrs } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentEmit, ComponentProps } from '~/types'

export function useVfmAttrs<TP extends Component, MP extends Component>(options: {
  props: ComponentProps<TP>
  modalProps: ComponentProps<MP>
  emit?: any
}) {
  const { props, modalProps, emit } = options
  const bindProps = computed(() => pickModalProps(props, modalProps))
  const bindEmits = byPassAllModalEvents(emit)
  const attrs = useAttrs()
  const vfmAttrs = computed(() => ({
    ...bindProps.value,
    ...bindEmits,
    ...attrs,
  }))

  return vfmAttrs
}

function pickModalProps(props: Record<string, any>, modalProps: Record<string, any>) {
  return Object.keys(modalProps).reduce<Record<string, any>>((acc, propName) => {
    acc[propName] = props?.[propName]
    return acc
  }, {})
}

function byPassAllModalEvents(emit?: ComponentEmit<typeof VueFinalModal>): ComponentProps<typeof VueFinalModal> {
  return {
    'onUpdate:modelValue': (val: boolean) => emit?.('update:modelValue', val),

    'onBeforeClose': (payload: { stop: () => void }) => emit?.('beforeClose', payload),
    'onClosed': () => emit?.('closed'),
    'onBeforeOpen': (payload: { stop: () => void }) => emit?.('beforeOpen', payload),
    'onOpened': () => emit?.('opened'),

    /** onClickOutside will only be emitted when clickToClose equal to `false` */
    'onClickOutside': () => emit?.('clickOutside'),
  }
}
