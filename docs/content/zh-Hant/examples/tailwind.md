---
title: 使用 Tailwind
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: 範例
position: 10
---

## 設計 `HOC`

<alert>

你可以很輕鬆地製作出一個高階元件（Higher-Order Components）並且依照不同的需求客製元件的內容。

</alert>

### VTailwindModal.vue

<show-code>

```vue
<template>
  <vue-final-modal
    v-slot="{ params, close }"
    v-bind="$attrs"
    classes="flex justify-center items-center"
    content-class="relative flex flex-col max-h-full mx-4 p-4 border dark:border-gray-800 rounded bg-white dark:bg-gray-900"
  >
    <span class="mr-8 text-2xl font-bold">
      <slot name="title"></slot>
    </span>
    <div class="flex-grow overflow-y-auto">
      <slot :params="params"></slot>
    </div>
    <div class="flex-shrink-0 flex justify-center items-center pt-4">
      <button class="vfm-btn" @click="$emit('confirm', close)">confirm</button>
      <button class="vfm-btn" @click="$emit('cancel', close)">cancel</button>
    </div>
    <button class="absolute top-0 right-0 mt-2 mr-2" @click="close">
      <mdi-close></mdi-close>
    </button>
  </vue-final-modal>
</template>

<script>
export default {
  name: 'VTailwindModal',
  inheritAttrs: false,
  emits: ['cancel', 'confirm']
}
</script>
```

</show-code>

## 如何使用 VTailwindModal

### 範例

<hoc-example-tailwind></hoc-example-tailwind>

<show-code class="pt-4">

```vue
<template>
  <div>
    <v-tailwind-modal v-model="show" @confirm="confirm" @cancel="cancel">
      <template v-slot:title>Hello, vue-final-modal</template>
      <p>
        Vue Final Modal is a renderless, stackable, detachable and lightweight
        modal component.
      </p>
    </v-tailwind-modal>

    <button class="vfm-btn" @click="show = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false
  }),
  methods: {
    confirm() {
      // some code...
      this.show = false
    },
    cancel(close) {
      // some code...
      close()
    }
  }
}
</script>
```

</show-code>