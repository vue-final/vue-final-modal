---
title: Usage with Typescript
description: 'Discover how you can use Vue Final Modal with TypeScript.'
category: Advanced
position: 12
fullscreen: true
version: 2
---

## Vue

It just works like a charm without any settings. But if you need to customize the setup [options](/setup#vfmplugin), you can define the type like below:

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

Add the types to your `types` array in `tsconfig.json` file

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
