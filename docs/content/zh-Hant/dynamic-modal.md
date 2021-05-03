---
title: 動態 modal
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: API
position: 8
version: 2
badge: v2.0.0+
features:
  - 支援 Vue 3 與 Vue 2
  - Tailwind CSS 友好
  - 無選染元件
  - 支援 SSR
  - 支援 modal 堆疊
  - Detachable
  - 可滾動的 modal
  - 支援過度效果
  - 行動裝置友善
  - 極小的打包尺寸
  - 支援無障礙（Accessibility）
---

這個功能讓你可以動態的建立 modal。

## 新增 `ModalsContainer`

所有的動態 modals 都會被崁入、顯示在 `ModalsContainer` 元件中。你可以透過 [$vfm.dynamicModals](#dynamicmodals) 屬性取得所有的動態 modal 實例 

```html[App.vue]
<div>
  ...
  <modals-container></modals-container>
</div>
```

## API

### `show(dynamicModalOptions, params)`

你可以透過 `$vfm.show` 這個方法開啟動態 modal。

- 型別： `Function`,
- 參數：
  - dynamicModalOptions: `Object`
  - params: 與 [API $vfm.show](/zh-Hant/api#showname-params) 相同
- 回傳: Promise<Object> | Promise<Array>

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

- 回傳: 
  - `Array`: 回傳儲存動態 modal 實例的陣列。

## 範例

<modals-container></modals-container>

### 基本

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

</show-code>

### 進階

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
                'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
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

<alert>VModal 是一個 vue-final-modal 的高階元件（HOC）。</alert>

[Source code](/zh-Hant/examples/recommend)

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