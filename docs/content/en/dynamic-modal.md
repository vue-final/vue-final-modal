---
title: Dynamic modal
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: API
position: 8
version: 2
badge: v2.0.0+
---

Vue Final Modal has a helper function to dynamically show a modal. This means that you don't have to add the modal to your Vue template and you don't have to use `v-model` to hide or show the modal. You can simply execute `$vfm.show` and pass a modal component as per the example below:

```js
import { $vfm } from 'vue-final-modal'

$vfm.show({ component: 'MyDynamicModal' })
```

The component `MyDynamicModal` is hypothetical, check the [Examples](#examples) below for an accurate example.

## Prerequisite

As a requirement to using Dynamic modals you must add `<ModalsContainer />` to your main `App.vue` file like so:

<sfc-view>

```vue[App.vue]
<template>
  <div>
    ...
    <modals-container></modals-container>
  </div>
</template>
```

```vue[App.vue]
<script>
import { ModalsContainer } from 'vue-final-modal'

export default {
  components: {
    ModalsContainer
  }
}
</script>
```

</sfc-view>


`ModalsContainer` is an invisible Vue component that is responsible for hosting the Vue instances of your dynamic modals. You don't need to do add anything else to the `ModalsContainer`, as long as you include it in your Vue tree, you can use Dynamic modals.

## API

### `$vfm.show(dynamicModalOptions, params)`

- Type: `Function`,
- Arguments:
  - dynamicModalOptions: `Object`
    ```ts
    type dynamicModalOptions = {
      component?: string | Component | AsyncComponent // modal component
      bind?: { [key: string]: any}, // bind props and attrs to modal
      on?: { [key: string]: Function | Function[] } // register events to modal
      slots?: {
        [key: string]: // slot name
          | {
              component: string | Component | AsyncComponent // slot component
              bind?: { [key: string]: any } // bind props and attrs to slot component
              on?: { [key: string]: Function | Function[] } // register events to slot component
            }
          | string
      }
    }
    ```
  - params: same as [API $vfm.show](/api#showname-params)
- Returns: `Promise<Object>` | `Promise<Array>`

To show dynamic modal you can use the API `$vfm.show` function.

### `$vfm.dynamicModals`

- Type: 
  - `Array`: returns dynamic modal instances.
- Examples:
  - get the first created dynamic modal instance
    ```js
      this.$vfm.dynamicModals[0]
    ```
  - get how many dynamic modals was created
    ```js
      this.$vfm.dynamicModals.length
    ```

## Examples

<modals-container></modals-container>

### Basic

<v-dynamic></v-dynamic>

<sfc-view>

```vue
<template>
  <v-button @click="dynamic">Open Dynamic Modal</v-button>
</template>
```

```vue
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

</sfc-view>

#### Register `modals-container` in `App.vue` for modal container.

<sfc-view>

```vue[App.vue]
<template>
  <div>
    ...
    <modals-container></modals-container>
  </div>
</template>
```

```vue[App.vue]
<script>
import { ModalsContainer } from 'vue-final-modal'

export default {
  components: {
    ModalsContainer
  }
}
</script>
```

</sfc-view>


#### VDynamicModal.vue

<sfc-view>

```vue
<template>
  <vue-final-modal
    v-slot="{ close }"
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
      <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
    </div>
  </vue-final-modal>
</template>
```
```vue
<script>
export default {
  inheritAttrs: false
}
</script>
```
```vue
<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
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
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
```

</sfc-view>

### Advanced

<v-dynamic-advanced></v-dynamic-advanced>

<sfc-view>

```vue
<template>
  <v-button @click="dynamic">Open Dynamic Modal</v-button>
</template>
```
```vue
<script>
import VContent from '../VContent.vue'

export default {
  methods: {
    dynamic() {
      this.$vfm.show({
        component: 'CustomModal',
        bind: {
          name: 'VDynamicAdvacedModal'
        },
        on: {
          // event by custom-modal
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

</sfc-view>

#### Register `modals-container` in `App.vue` for modal container.

<sfc-view>

```vue[App.vue]
<template>
  <div>
    ...
    <modals-container></modals-container>
  </div>
</template>
```

```vue[App.vue]
<script>
import { ModalsContainer } from 'vue-final-modal'

export default {
  components: {
    ModalsContainer
  }
}
</script>
```

</sfc-view>


#### CustomModal.vue

<alert>Write an HOC called `CustomModal` base on `VueFinalModal` in vue-final-modal.</alert>

> [See recommend usage](/examples/recommend)

<sfc-view>

```vue
<template>
  <vue-final-modal v-bind="$attrs" classes="modal-container" content-class="modal-content" v-on="$listeners">
    <template v-slot="{ params }">
      <span class="modal__title">
        <slot name="title"></slot>
      </span>
      <div class="modal__content">
        <slot v-bind:params="params"></slot>
      </div>
      <div class="modal__action">
        <v-button @click="$emit('confirm', close)">confirm</v-button>
        <v-button @click="$emit('cancel', close)">cancel</v-button>
      </div>
      <button class="modal__close" @click="close">
        <mdi-close></mdi-close>
      </button>
    </template>
  </vue-final-modal>
</template>
```
```vue
<script>
export default {
  name: 'CustomModal',
  inheritAttrs: false,
  methods: {
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
```
```vue
<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
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
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
```
</sfc-view>

#### VTitle.vue

<sfc-view>

```vue
<template>
  <div>{{ text }}</div>
</template>
```
```vue
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

</sfc-view>

#### VContent.vue

<sfc-view>

```vue
<template>
  <p>{{ content }}</p>
</template>
```
```vue
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

</sfc-view>
