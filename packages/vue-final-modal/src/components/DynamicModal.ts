import type { Component, PropType } from 'vue'
import { defineComponent, h } from 'vue'
import type { ModalSlotOptions, UseModalOptions, UseModalOptionsPrivate } from '..'
import { destroyVNode, isModalSlotOptions, useVfm } from '~/useApi'
import { isString, objectEntries } from '~/utils'

export const DynamicModal = defineComponent({
  name: 'DynamicModal',
  props: {
    modal: {
      type: Object as PropType<UseModalOptions<Component> & UseModalOptionsPrivate>,
      required: true,
    },
  },
  setup(props) {
    const { dynamicModals } = useVfm()
    function renderDynamicModal(modal: (UseModalOptions<Component> & UseModalOptionsPrivate)) {
      if (!modal.component)
        return null
      const slots = objectEntries(modal.slots || {}).reduce((acc, cur) => {
        const slotName = cur[0] as string
        const slot = cur[1] as string | Component | ModalSlotOptions
        if (isString(slot))
          acc[slotName] = () => h('div', { innerHTML: slot })
        else if (isModalSlotOptions(slot))
          acc[slotName] = () => h(slot.component, slot.attrs)
        else
          acc[slotName] = () => h(slot)
        return acc
      }, {} as any)

      return h(modal.component, {
        'modelValue': modal.modelValue,
        'displayDirective': modal?.keepAlive ? 'show' : undefined,
        ...(typeof modal.attrs === 'object' ? modal.attrs : {}),
        'onUpdate:modelValue': (value: boolean) => {
          modal.modelValue = value
          const onUpdateModelValue = modal.attrs?.['onUpdate:modelValue']
          if (onUpdateModelValue)
            onUpdateModelValue(value)
        },
        'on_closed': () => {
          modal?.resolveClosed?.()
          if (!modal.keepAlive) {
            const vNode = dynamicModals.find(component => component.key === modal.id)
            if (!vNode)
              return
            destroyVNode(vNode)
          }
        },
        'on_opened': () => modal?.resolveOpened?.(),
      }, slots)
    }

    return () => renderDynamicModal(props.modal)
  },
})
