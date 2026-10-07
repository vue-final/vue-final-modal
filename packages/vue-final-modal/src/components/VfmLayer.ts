import { defineComponent, h, ref, vShow, withDirectives } from 'vue'
import { vVisible } from '~/composables/vVisible'

/**
 * A div hidden by exactly one directive, so the `<Transition>` around it starts each enter and leave once.
 * `keepLayout` hides with `visibility` instead of `display`, for `displayDirective: 'visible'`.
 */
export const VfmLayer = defineComponent({
  name: 'VfmLayer',
  inheritAttrs: false,
  props: {
    shown: { type: Boolean, required: true },
    keepLayout: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots, expose }) {
    const el = ref<HTMLDivElement>()
    expose({ el })
    return () => withDirectives(
      h('div', { ...attrs, ref: el }, slots.default?.()),
      [[props.keepLayout ? vVisible : vShow, props.shown]],
    )
  },
})
