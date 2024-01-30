import type { Component, PropType } from 'vue'
import { defineComponent } from 'vue'
import type { UseModalTemplate, UseModalTemplatePrivate } from '~/types'
import { templateToVNode } from '~/composables/useTemplate'

export const UseModal = defineComponent({
  name: 'UseModal',
  props: {
    template: {
      type: Object as PropType<UseModalTemplate<Component> & UseModalTemplatePrivate>,
      required: true,
    },
  },
  setup(props) {
    function renderModalTemplate(template: (UseModalTemplate<Component> & UseModalTemplatePrivate)) {
      if (!template.component)
        return null
      return templateToVNode({
        component: template.component,
        attrs: {
          'modelValue': template.modelValue,
          'displayDirective': template?.keepAlive ? 'show' : undefined,
          ...(typeof template.attrs === 'object' ? template.attrs : {}),
          'onUpdate:modelValue': (value: boolean) => {
            template.modelValue = value
            const onUpdateModelValue = template.attrs?.['onUpdate:modelValue']
            if (onUpdateModelValue)
              onUpdateModelValue(value)
          },
          'on_closed': () => template?.resolveClosed?.(),
          'on_opened': () => template?.resolveOpened?.(),
        },
        slots: template.slots,
      })
    }

    return () => renderModalTemplate(props.template)
  },
})
