import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { UseModalOptions, UseModalOptionsPrivate } from '..'
import { getSlots } from '~/useVNode'

export const DynamicModal = defineComponent({
  name: 'DynamicModal',
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

      return h(
        modal.component,
        {
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
        getSlots(modal.slots || {}),
      )
    }

    return () => renderDynamicModal(props.modal)
  },
})
