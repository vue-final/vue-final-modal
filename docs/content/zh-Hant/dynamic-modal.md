---
title: 動態 modal
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: API
position: 8
version: 2
badge: v2.0.0+
---

Vue Final Modal 提供一個輔助函式用於動態顯示 modal，這意味著你不需要將元件 `vue-final-modal` 新增到你的 Vue 模板 (template) 中，你也不需要使用 `v-model` 來隱藏或顯示 modal。你可以簡單地執行 `$vfm.show` 並帶入一個 modal 元件像是下面這個範例：

```js
import { $vfm } from 'vue-final-modal'

$vfm.show({ component: 'MyDynamicModal' })
```

`MyDynamicModal` 元件是個舉例，可以到下方查看完整的[範例](#examples)。

## 先決條件

首先，使用動態 modal 的前提是你必須將元件 `<ModalsContainer />` 加入你的根元件 `App.vue` 像是這樣：

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


`ModalsContainer` 是一個不可見的元件，負責在 Vue 實例中託管動態 modal。你不需要新增任何屬性 (property) 或 HTML 在 `ModalsContainer` 中，只需要將其引入在你的 Vue 元件樹中，就可以使用動態 modal。

## API

### `$vfm.show(dynamicModalOptions, params)`

- 型別： `Function`,
- 參數：
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
  - params: 與 [API $vfm.show](/zh-Hant/api#showname-params) 相同
- 回傳： `Promise<Object>` | `Promise<Array>`

你可以透過 `$vfm.show` 這個方法開啟動態 modal。

### `$vfm.dynamicModals`

- 回傳：
  - `Array`: 回傳儲存動態 modal 實例的陣列。
- 範例：
  - 取得第一個創建的動態 modal 實例
    ```js
      this.$vfm.dynamicModals[0]
    ```
  - 取得現在創建的動態 modal 總數
    ```js
      this.$vfm.dynamicModals.length
    ```

## 範例

<modals-container></modals-container>

### 基本

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

#### 在 `App.vue` 中註冊 `modals-container` 元件。

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

### 進階

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

#### 在 `App.vue` 中註冊 `modals-container` 元件。

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

<alert>基於 vue-final-modal 中的 `VueFinalModal` 寫一個叫做 `CustomModal` 的高階元件（HOC）</alert>

[Source code](/zh-Hant/examples/recommend)

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