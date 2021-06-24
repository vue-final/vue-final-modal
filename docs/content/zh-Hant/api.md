---
title: API 參考
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: API
position: 7
version: 2
---

## Usage

<alert>`$vfm` 是一個存放 VueFinalModal 資料與方法的物件</alert>

### **直接引入**

```js
import { $vfm } from 'vue-final-modal'
```

### **使用 Options API**

如果你全域註冊套件，
可以在組件內使用 `this.$vfm`.

### **使用 Composition API** <badge>Vue 3 only</badge>

如果你全域註冊套件，你可以在 `setup` 中使用 `inject('$vfm')`

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

- 型別： `Function`
- 參數：
  - name: `String` - 指定 modal 的名字。
  - params: `?: object` - Any data that you want to pass into the modal, checkout the guide [params](/zh-Hant/guide/params).
- 回傳： `Promise<Object>` | `Promise<Array>`
- 範例：

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

  <alert>如果要使用 `$vfm.show(name)` 打開 modal，`v-model` 是必須給的。</alert>

### `$vfm.hide([names])`

- 型別： `Function`
- 參數：
  - names: `String` - 指定要隱藏 modal 名稱。
- 回傳： `Promise<Object>` | `Promise<Array>`
- 範例：

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

- 回傳： `Promise<Object>` | `Promise<Array>`
- 範例：

  ```js
  this.$vfm.hideAll().then(() => {
    // 當所有 modal 關閉後，做一些事
  })
  ```

關閉所有的 modal。

```js
this.$vfm.hideAll().then(() => {
  // 當所有 modal 關閉後，做一些事
})
```

### `$vfm.toggle(name, show, params)`

- 型別： `Function`
- 參數：
  - name: [`String` | `Array`] - modal 的名稱。
  - show: `?: Boolean` - 打開或隱藏這個 modal。
  - params: `?: object` - 任何你想要傳入 modal 的資料，詳閱 [參數（params）](/zh-Hant/guide/params)。
- 回傳： `Promise<Object>` | `Promise<Array>`
- 範例：

  ```js
  this.$vfm.toggle('myModal').then(() => {
    // 當多個 modal 被開啟或被關閉時，做一些事，開啟或關閉取決於 show 參數給的是 true 或 false
  })
  ```

根據名字（name）切換 modals 的狀態。

```js
this.$vfm.toggle('myModal').then(() => {
  // 當多個 modal 被開啟或被關閉時，做一些事，開啟或關閉取決於 show 參數給的是 true 或 false
})
```

### `$vfm.get([names])`

- 型別： `Function`
- 參數：
  - names: `String` - 取得傳入的名字（name）對應的 modals 實例。
- 回傳：
  - `Array`: 回傳的 modals 實例
- 範例：

  ```js
  const modals = this.$vfm.get('modalName1', 'modalName2', ...)
  ```

### `$vfm.openedModals`

- 回傳：
  - `Array`: 回傳所有顯示中的 modal 實例。
- 範例：
  - 取得第一個打開的 modal 實例
    ```js
      this.$vfm.modals[0]
    ```
  - 取得現在打開的 modal 總數
    ```js
      this.$vfm.modals.length
    ```

1. `$vfm.openedModals[0]`: 取得第一個打開的 modal 實例。
2. `$vfm.openedModals.length`: 取得現在打開的 modal 總數。

### `$vfm.modals`

- 回傳：
  - `Array`: 取得所有 modal 的實例。
- 範例：
  - 取得第一個創建的 modal 實例
    ```js
      this.$vfm.modals[0]
    ```
  - 取得現在創建的 modal 總數
    ```js
      this.$vfm.modals.length
    ```
