import type { Component, PropType } from 'vue'
import type { Template } from 'vue-use-template'
import { defineComponent, onMounted } from 'vue'
import { mergeTemplateAttrs, templateToVNodeFn } from 'vue-use-template'

/** The template useModal() hands over, its attrs resolved into an object whose values vue-use-template unwraps when it renders. */
export type ResolvedTemplate = Omit<Template<Component>, 'attrs'> & { attrs: Record<string, any> }

export const UseModal = defineComponent({
  name: 'UseModal',
  props: {
    template: {
      type: Object as PropType<ResolvedTemplate>,
      required: true,
    },
    modelValue: {
      type: Boolean,
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
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    /**
     * `templateToVNodeFn` creates a new vnode key per call, so it must be
     * called once here: calling it inside the render function would remount
     * `template.component` on every re-render and skip its leave transition.
     */
    const vNodeFn = templateToVNodeFn(() => {
      const { component, slots } = props.template
      /** Merged here, the way vue-use-template merges attrs, props and emits, for the model value wiring to come last. */
      const bound: Record<string, any> = mergeTemplateAttrs(props.template)
      return {
        component,
        slots,
        attrs: {
          ...bound,
          'modelValue': props.modelValue,
          'onUpdate:modelValue': (value: boolean) => {
            emit('update:modelValue', value)
            bound['onUpdate:modelValue']?.(value)
          },
          'on_opened': props.onOpened,
          'on_closed': props.onClosed,
          'on_stopped': props.onStopped,
        },
      }
    })

    /** A modal closed before it rendered never opens, so nothing else reports it closed for useModal() to settle close() and drop it. */
    onMounted(() => {
      if (!props.modelValue)
        props.onClosed()
    })

    return () => vNodeFn()
  },
})
