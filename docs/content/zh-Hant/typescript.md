---
title: TypeScript 支援
description: '了解如何將 Vue Final Modal 與 TypeScript 一起使用。'
category: 進階
position: 12
fullscreen: true
version: 2
---

## Vue

不需要任何設定即可使用. 但如果你想要自己定義設定 [選項（options）](/zh-Hant/setup#vfmplugin), 你可以像這樣處理：

```ts[main.ts]
import Vue from 'vue'
import { vfmPlugin, VfmOptions, VueFinalModalProperty } from 'vue-final-modal'

Vue.use<VfmOptions>(vfmPlugin({
  key: '$vfm',
  componentName: 'VueFinalModal',
  dynamicContainerName: 'ModalsContainer'
}))

// define the setup options
declare module 'vue/types/vue' {
  interface Vue {
    $vfm: VueFinalModalProperty
  }
}
```

## Nuxt

在 `tsconfig.json` 設定中的 `types` 陣列中加上這個型別。

```js[tsconfig.json]
{
  "compilerOptions": {
    "types": [
      // other types
      // ...
      "vue-final-modal"
    ]
  }
}
```
