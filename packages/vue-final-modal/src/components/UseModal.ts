import type { Component, PropType } from 'vue'
import { defineComponent } from 'vue'
import type { UseModalOptions, UseModalOptionsPrivate } from '..'
import { createVNode } from '~/useVNode'

export const UseModal = defineComponent({
  name: 'UseModal',
  props: {
    modal: {
      type: Object as PropType<UseModalOptions<Component> & UseModalOptionsPrivate>,
      required: true,
    },
  },
  setup(props) {
    function renderDynamicModal(modal: (UseModalOptions<Component> & UseModalOptionsPrivate)) {
      if (!modal.component)
        return null
      return createVNode({
        component: modal.component,
        attrs: {
          'modelValue': modal.modelValue,
          'displayDirective': modal?.keepAlive ? 'show' : undefined,
          ...(typeof modal.attrs === 'object' ? modal.attrs : {}),
          'onUpdate:modelValue': (value: boolean) => {
            modal.modelValue = value
            const onUpdateModelValue = modal.attrs?.['onUpdate:modelValue']
            if (onUpdateModelValue)
              onUpdateModelValue(value)
          },
          'on_closed': () => modal?.resolveClosed?.(),
          'on_opened': () => modal?.resolveOpened?.(),
        },
        slots: modal.slots,
      })
    }

    return () => renderDynamicModal(props.modal)
  },
})
