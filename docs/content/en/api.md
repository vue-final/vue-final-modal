---
title: API Reference
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: API
position: 7
version: 2
---

## Usage

<alert>`$vfm` is an object containing VueFinalModal's data/methods.</alert>

### **Directly import**

```js
import { $vfm } from 'vue-final-modal'
```

### **Options API**

If you register plugin globally.
Just use `this.$vfm`.

### **Composition API** <badge>Vue 3 only</badge>

If you register plugin globally.
You can use `inject('$vfm')` in `setup`.
```js
import { inject } from 'vue'

export default {
  setup() {
    const $vfm = inject('$vfm')
  }
}
```
## API

### `$vfm.show(name, params)`

- Type: `Function`
- Arguments:
  - name: `String` - Name of the modal
  - params: `?: object` - Any data that you want to pass into the modal, checkout the guide [params](/guide/params).
- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  <v-api-show class="mb-4"></v-api-show>

  <sfc-view>

  ```html
  <template>
    <vue-final-modal v-model="show" name="example">
      <template v-slot:title>$vfm.show</template>
      <template v-slot="{ params }">
        Hi {{ params.userName }}
      </template>
    </vue-final-modal>
  </template>
  <script>
    export default {
      data: () => ({
        show: false
      })
    }
  </script>
  ```

  ```js
  this.$vfm.show('example', { userName: 'vue-final-modal' })
    .then(() => {
      // do something on modal opened
    })
  ```

  </sfc-view>

  <alert>`v-model` is necessary when you open a modal with `$vfm.show(name)` API.</alert>

### `$vfm.hide([names])`

- Type: `Function`
- Arguments:
  - names: `String` - The names to hide
- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  <sfc-view>

  ```vue
  <template>
    <vue-final-modal v-model="show" name="example">Vue Final Modal is awesome</vue-final-modal>
    <vue-final-modal v-model="show2" name="example2">Vue Final Modal is awesome 2</vue-final-modal>
  </template>
  ```

  ```vue
  <script>
    export default {
      data: () => ({
        show: true,
        show2: true
      }),
      mounted() {
        this.$vfm.hide('example', 'example2').then(() => {
          // do something on modal closed
        })
      }
    }
  </script>
  ```

  </sfc-view>

### `$vfm.hideAll()`

- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  ```js
  this.$vfm.hideAll().then(() => {
    // do something on all modals closed
  })
  ```

Hide all modals.

```js
this.$vfm.hideAll().then(() => {
  // do something on all modals closed
})
```

### `$vfm.toggle(name, show, params)`

- Type: `Function`
- Arguments:
  - name: [`String` | `Array`] - The names of the modal
  - show: `?: Boolean` - Show modal or not
  - params: `?: object` - Any data that you want to pass into the modal, checkout the guide [params](/guide/params).
- Returns: `Promise<Object>` | `Promise<Array>`
- Example:

  ```js
  this.$vfm.toggle('myModal').then(() => {
    // do something on modals opened or closed, it depends on params `show` is true or false
  })
  ```

Toggle modals by name.

```js
this.$vfm.toggle('myModal').then(() => {
  // do something on modals opened or closed, it depends on params `show` is true or false
})
```

### `$vfm.get([names])`

Get the modal instances by modal names.

- Type: `Function`
- Arguments:
  - names: `String`
- Return:
  - `Array`: returns the modal instances
- Example:

  ```js
  const modals = this.$vfm.get('modalName1', 'modalName2', ...)
  ```

### `$vfm.openedModals`

- Return:
  - `Array`: returns the opened modal instances.
- Examples:
  - get the first opened modal instance
    ```js
      this.$vfm.openedModals[0]
    ```
  - get how many modals was opened
    ```js
      this.$vfm.openedModals.length
    ```

### `$vfm.modals`

- Return:
  - `Array`: returns all modal instances.
- Examples:
  - get the first created modal instance
    ```js
      this.$vfm.modals[0]
    ```
  - get how many modals was created
    ```js
      this.$vfm.modals.length
    ```