import type {
  AsyncComponentLoader,
  AsyncComponentOptions,
  Component,
  ComponentPublicInstance,
} from 'vue'

import {
  defineAsyncComponent,
  defineComponent,
  h,
} from 'vue'

export function defineLazyMountComponent<
  T extends Component = {
    new (): ComponentPublicInstance
  },
>(
  source: AsyncComponentLoader<T> | AsyncComponentOptions<T>,
): T {
  return defineComponent({
    name: 'LazyMountComponent',
    setup(_, { attrs }) {
      let mounted = false
      return () => {
        if (attrs.modelValue || mounted) {
          return h(defineAsyncComponent(source), {
            ...attrs,
            onVnodeMounted: () => {
              mounted = true
            },
          })
        }
        return undefined
      }
    },
  }) as T
}
