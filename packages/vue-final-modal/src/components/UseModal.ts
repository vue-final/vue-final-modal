import type { Component, PropType, Ref } from 'vue'
import { defineComponent } from 'vue'
import type { Template } from 'vue-use-template'
import { templateToVNodeFn } from 'vue-use-template'
import type { PrivateFields } from '~/types'

export const UseModal = defineComponent({
  name: 'UseModal',
  props: {
    template: {
      type: Object as PropType<Template<Component>>,
      required: true,
    },
    privateFields: {
      type: Object as PropType<Ref<PrivateFields>>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Ref<boolean>>,
      required: true,
    },
  },
  setup(props) {
    /**
     * `templateToVNodeFn` creates a new vnode key per call, so it must be
     * called once here: calling it inside the render function would remount
     * `template.component` on every re-render and skip its leave transition.
     */
    const vNodeFn = templateToVNodeFn(() => {
      const { template, privateFields, modelValue } = props
      return {
        component: template.component,
        attrs: {
          'modelValue': modelValue.value,
          ...(typeof template.attrs === 'object' ? template.attrs : {}),
          'onUpdate:modelValue': (value: boolean) => {
            modelValue.value = value
            const onUpdateModelValue = template.attrs?.['onUpdate:modelValue']
            if (onUpdateModelValue)
              onUpdateModelValue(value)
          },
          'on_closed': () => {
            privateFields.value?.resolveClosed?.()
          },
          'on_opened': () => {
            privateFields.value?.resolveOpened?.()
          },
        },
        props: template.props,
        emits: template.emits,
        slots: template.slots,
      }
    })

    return () => vNodeFn()
  },
})
