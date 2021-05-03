---
title: Dynamic modal
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: API
position: 8
version: 2
badge: v2.0.0+
features:
  - Support Vue 3 and Vue 2
  - Tailwind CSS friendly
  - Renderless component
  - SSR support
  - Stackable
  - Detachable
  - Scrollable
  - Transition support
  - Mobile friendly
  - Tiny bundle size
  - Accessibility support
---

This feature let you create modal dynamically.

## Add `ModalsContainer`

All dynamic modals will be displayed in `ModalsContainer`. You can get all dynamic modal instances by [$vfm.dynamicModals](#dynamicmodals).

```html[App.vue]
<div>
  ...
  <modals-container></modals-container>
</div>
```

## API

### `show(dynamicModalOptions, params)`

To show dynamic modal you can use the API `$vfm.show` function.

- Type: `Function`,
- Arguments:
  - dynamicModalOptions: `Object`
  - params: same as [API $vfm.show](/api#showname-params)
- Returns: Promise<Object> | Promise<Array>

```ts
type dynamicModalOptions = {
  component?: string | Component // modal component
  bind?: { [key: string]: any}, // bind props and attrs to modal
  on?: { [key: string]: Function | Function[] } // register events to modal
  slots?: {
    [key: string]: // slot name
      | {
          component: string | Component // slot component
          bind?: { [key: string]: any } // bind props and attrs to slot component
          on?: { [key: string]: Function | Function[] } // register events to slot component
        }
      | string
  }
}
```

### `dynamicModals`

- Return: 
  - `Array`: returns dynamic modal instances.

## Examples

<modals-container></modals-container>

### Basic

<v-dynamic></v-dynamic>

<show-code class="pt-4">

```vue
<template>
  <button class="vfm-btn mb-4" @click="dynamic">Open Dynamic Modal</button>
</template>

<script>
export default {
  methods: {
    dynamic() {
      this.$vfm.show({
        component: 'VDynamicModal'
      })
    }
  }
}
</script>
```

</show-code>

#### VDynamicModal.vue

<show-code class="pt-4">

```vue
<template>
  <vue-final-modal
    v-bind="$attrs"
    classes="modal-container"
    content-class="modal-content"
    v-on="$listeners"
  >
    <button class="modal__close" @click="close">
      <mdi-close></mdi-close>
    </button>
    <span class="modal__title">Hello, vue-final-modal</span>
    <div class="modal__content">
      <p>
        Vue Final Modal is a renderless, stackable, detachable and lightweight
        modal component.
      </p>
    </div>
  </vue-final-modal>
</template>

<script>
export default {
  inheritAttrs: false,
  methods: {
    close() {
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>
::v-deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep(.modal-content) {
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>

```

</show-code>

### Advanced

<v-dynamic-advanced></v-dynamic-advanced>

<show-code class="pt-4">

```vue
<template>
  <button class="vfm-btn mb-4" @click="dynamic">Open Dynamic Modal</button>
</template>

<script>
import VContent from '../VContent.vue'

export default {
  methods: {
    dynamic() {
      this.$vfm.show({
        component: 'VModal',
        bind: {
          name: 'VDynamicAdvacedModal'
        },
        on: {
          // event by v-modal
          confirm(close) {
            console.log('confirm')
            close()
          },
          cancel(close) {
            console.log('cancel')
            close()
          },
          // event by vue-final-modal
          'click-outside'() {
            console.log('@click-outside')
          },
          'before-open'() {
            console.log('@before-open')
          },
          opened() {
            console.log('@opened')
          },
          'before-close'() {
            console.log('@before-close')
          },
          closed() {
            console.log('@closed')
          }
        },
        slots: {
          title: {
            component: 'VTitle',
            bind: {
              text: 'Hello, vue-final-modal'
            }
          },
          default: {
            component: VContent,
            bind: {
              content:
                'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
            }
          }
        }
      })
    }
  }
}
</script>
```

</show-code>

#### VModal.vue

<alert>VModal is an HOC of vue-final-modal.</alert>

[Source code](/examples/recommend)

#### VTitle.vue

<show-code class="pt-4">

```vue
<template>
  <div>{{ text }}</div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
```

</show-code>

#### VContent.vue


<show-code class="pt-4">

```vue
<template>
  <p>{{ content }}</p>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>
```

</show-code>