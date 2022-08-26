# API reference

## Usage

`$vfm` is an object containing VueFinalModal's data/methods.

```js
import { $vfm } from 'vue-final-modal'
```

## API

### `$vfm.show(name)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal
- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  <VApiExample></VApiExample>

  <!-- <CodeBlock :importComponentInstanceFn="() => import('@/components/use-cases/VApiExample.vue')" :importComponentRawFn="() => import('@/components/use-cases/VApiExample.vue?raw')"></CodeBlock> -->

  ```vue
  <template>
    <VModal
      v-model="show"
      name="ModalName"
      title="API example"
      @confirm="$vfm.hide('ModalName')"
      @cancel="$vfm.hide('ModalName')"
    >
      Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
    </VModal>

    <button class="btn btn--highlight" @click="$vfm.show('ModalName')">Open confirm dialog</button>
  </template>

  <script setup>
  import { ref } from 'vue'
  import { $vfm } from 'vue-final-modal'

  const show = ref(false)

  function openModal() {
    $vfm.show('ModalName').then(() => {
      // do something when modal is opened
    })
  }
  </script>
  ```

  :::info
  `VModal` is a HOC component of vue-final-modal. See how to use [Step by step - VModal](/guide/step-by-step#vmodal-vue).
  :::

  :::tip
  `v-model` is necessary when you open a modal with `$vfm.show(name)` API.
  :::

### `$vfm.hide([names])`

- Type: `Function`
- Arguments:
  - names: `String` - The names to hide
- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  ```vue
  <template>
    <vue-final-modal v-model="show" name="ModalName1">
      VFM is awesome
    </vue-final-modal>
    <vue-final-modal v-model="show2" name="ModalName2">
      VFM is awesome 2
    </vue-final-modal>
  </template>

  <script setup>
  import { ref } from 'vue'
  import { $vfm } from 'vue-final-modal'

  const show = ref(true)
  const show2 = ref(true)

  $vfm.hide('ModalName1', 'ModalName2').then(() => {
    // do something when modals are closed
  })
  </script>
  ```

  <!-- </sfc-view> -->

### `$vfm.hideAll()`

- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  ```js
  import { $vfm } from 'vue-final-modal'

  $vfm.hideAll().then(() => {
    // do something on all modals closed
  })
  ```

  Hide all modals.

### `$vfm.toggle(name, show)`

- Type: `Function`
- Arguments:
  - name: [`String` | `Array`] - The names of the modal
  - show: `?: Boolean` - Show modal or not
- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  ```js
  import { $vfm } from 'vue-final-modal'

  $vfm.toggle('myModal').then(() => {
    // do something on modal opened or closed
  })
  ```

Toggle modals by name.

### `$vfm.get([names])`

Get the modal instances by modal names.

- Type: `Function`
- Arguments:
  - names: `String`
- Return:
  - `Array`: returns the modal instances
- Example:

  ```js
  import { $vfm } from 'vue-final-modal'

  const modals = $vfm.get('modalName1', 'modalName2', ...)
  ```

### `$vfm.openedModals`

- Return:
  - `Array`: returns the opened modal instances.
- Examples:

  - get the first opened modal instance

    ```js
    import { $vfm } from 'vue-final-modal'

    $vfm.openedModals[0]
    ```

  - get how many modals was opened

    ```js
    import { $vfm } from 'vue-final-modal'

    $vfm.openedModals.length
    ```

### `$vfm.modals`

- Return:
  - `Array`: returns all modal instances.
- Examples:

  - get the first created modal instance

    ```js
    import { $vfm } from 'vue-final-modal'

    $vfm.modals[0]
    ```

  - get how many modals was created

    ```js
    import { $vfm } from 'vue-final-modal'

    $vfm.modals.length
    ```
