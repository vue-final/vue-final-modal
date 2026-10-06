import type { Component, PropType, Ref } from 'vue'
import { defineComponent, toValue } from 'vue'
import type { Template } from 'vue-use-template'
import { templateToVNodeFn } from 'vue-use-template'

export const UseModal = defineComponent({
  name: 'UseModal',
  props: {
    template: {
      type: Object as PropType<Ref<Template<Component>>>,
      required: true,
    },
    modelValue: {
      type: Object as PropType<Ref<boolean>>,
      required: true,
    },
    onOpened: {
      type: Function as PropType<() => void>,
      required: true,
    },
    onClosed: {
      type: Function as PropType<() => void>,
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
      const { modelValue } = props
      const template = props.template.value
      const attrs = toValue(template.attrs)
      return {
        ...template,
        attrs: {
          'modelValue': modelValue.value,
          ...attrs,
          'onUpdate:modelValue': (value: boolean) => {
            modelValue.value = value
            attrs?.['onUpdate:modelValue']?.(value)
          },
          'on_opened': props.onOpened,
          'on_closed': props.onClosed,
        },
      }
    })

    return () => vNodeFn()
  },
})
