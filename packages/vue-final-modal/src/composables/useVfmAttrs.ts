import type { Component } from 'vue'
import { computed, useAttrs } from 'vue'
import type VueFinalModal from '~/components/VueFinalModal.vue'
import type { ComponentEmit, ComponentProps } from '~/types'

/** Binds a wrapper component's modal props, events and fallthrough attrs onto its inner `<VueFinalModal>`. */
export function useVfmAttrs<TP extends Component, MP extends Component>(options: {
  props: ComponentProps<TP>
  modalProps: ComponentProps<MP>
  emit?: any
}) {
  const { props, modalProps, emit } = options
  const attrs = useAttrs()
  const forwardedEvents = forwardModalEvents(emit)

  return computed(() => ({
    ...Object.fromEntries(Object.keys(modalProps).map(name => [name, props?.[name]])),
    ...forwardedEvents,
    ...attrs,
  }))
}

function forwardModalEvents(emit?: ComponentEmit<typeof VueFinalModal>): ComponentProps<typeof VueFinalModal> {
  return {
    'onUpdate:modelValue': (val: boolean) => emit?.('update:modelValue', val),
    'onBeforeOpen': (payload: { stop: () => void }) => emit?.('beforeOpen', payload),
    'onOpened': () => emit?.('opened'),
    'onBeforeClose': (payload: { stop: () => void }) => emit?.('beforeClose', payload),
    'onClosed': () => emit?.('closed'),
    'onClickOutside': () => emit?.('clickOutside'),
  }
}
