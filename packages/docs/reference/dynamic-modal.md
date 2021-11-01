# Dynamic Modal

Vue Final Modal has a helper function to dynamically show a modal. This means that you don't have to add the modal to your Vue template and you don't have to use `v-model` to hide or show the modal. You can simply execute `useModal` and pass a modal component as per the example below:

```js
import { useModal } from 'vue-final-modal'

const { show, hide, options } = useModal({ component: 'MyDynamicModal' })

show().then(() => {
  /** do something on modal opened */
})

hide().then(() => {
  /** do something on modal closed */
})

options.component === 'MyDynamicModal' // true
```

The component `MyDynamicModal` is hypothetical, check the [advanced example](#advanced-example) below for an accurate example.

## useModal hook

- Type: `Function`,
- Arguments:
  - dynamicModalOptions: `Object`
    ```ts
    type dynamicModalOptions = {
      component?: string | Component // modal component
      bind?: { [key: string]: any } // bind props and attrs to modal
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
- Returns: `{ show, hide, options }`

To show dynamic modal you can use `useModal` hook.

## Prerequisite

<ModalsContainer></ModalsContainer>

As a requirement to using Dynamic modals you must add `<ModalsContainer />` to your main `App.vue` file like so:

```vue
<template>
  <div>
    ...
    <ModalsContainer></ModalsContainer>
  </div>
</template>

<script setup>
import { ModalsContainer } from 'vue-final-modal'
</script>
```

`ModalsContainer` is an invisible Vue component that is responsible for hosting the Vue instances of your dynamic modals. You don't need to do add anything else to the `ModalsContainer`, as long as you include it in your Vue tree, you can use Dynamic modals.

## API

### `$vfm.show(dynamicModalOptions)`

- Type: `Function`,
- Arguments:
  - dynamicModalOptions: `Object`
    ```ts
    type dynamicModalOptions = {
      component?: string | Component // modal component
      bind?: { [key: string]: any } // bind props and attrs to modal
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

## Basic example

:::warning
Remember to register [ModalsContainer](#prerequisite) component globally.
:::

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VDynamic.vue')" :importComponentRawFn="() => import('@/components/use-cases/VDynamic.vue?raw')"></CodeBlock>

### VConfirm.vue

<CodeBlock :importComponentRawFn="() => import('@/components/use-cases/VConfirm.vue?raw')"></CodeBlock>

## Advanced example

:::warning
Remember to register [ModalsContainer](#prerequisite) component globally.
:::

<CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VDynamicAdvanced.vue')" :importComponentRawFn="() => import('@/components/use-cases/VDynamicAdvanced.vue?raw')"></CodeBlock>

#### VModal.vue

<CodeBlock title="VModal.vue" :importComponentRawFn="() => import('@/components/use-cases/VModal.vue?raw')"></CodeBlock>

#### VDescription.vue

<CodeBlock :importComponentRawFn="() => import('@/components/common/VDescription.vue?raw')"></CodeBlock>

<script setup>
import { ModalsContainer } from 'vue-final-modal'
</script>
