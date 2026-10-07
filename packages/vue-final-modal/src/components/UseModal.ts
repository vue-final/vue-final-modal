import type { Component, PropType, Ref } from 'vue'
import { defineComponent, toValue } from 'vue'
import type { Template } from 'vue-use-template'
import { templateToVNodeFn } from 'vue-use-template'

/** The template useModal() hands over, its attrs already unwrapped into a plain object. */
export type ResolvedTemplate = Omit<Template<Component>, 'attrs'> & { attrs: Record<string, any> }

export const UseModal = defineComponent({
  name: 'UseModal',
  props: {
    template: {
      type: Object as PropType<Ref<ResolvedTemplate>>,
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
    onStopped: {
      type: Function as PropType<(opening: boolean) => void>,
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
      const { attrs, props: templateProps, emits, ...template } = props.template.value
      /** vue-use-template applies props and emits after attrs, so they are merged here for the model value wiring to come last. */
      const bound: Record<string, any> = { ...attrs, ...toValue(templateProps), ...toValue(emits) }
      return {
        ...template,
        attrs: {
          ...bound,
          'modelValue': modelValue.value,
          'onUpdate:modelValue': (value: boolean) => {
            modelValue.value = value
            bound['onUpdate:modelValue']?.(value)
          },
          'on_opened': props.onOpened,
          'on_closed': props.onClosed,
          'on_stopped': props.onStopped,
        },
      }
    })

    return () => vNodeFn()
  },
})
