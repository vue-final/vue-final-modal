---
title: 選項（Options）
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
category: 快速入門
position: 2
version: 2
---

Options 作為 `Vue.use` 的第二個參數。

```js
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal(), { 
    componentName: 'VueFinalModal',
    key: '$vfm',    
    dynamicContainerName: 'ModalsContainer'
})
```

或作為 `VueFinalModal` 的第一個參數。

```js
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal({ 
    componentName: 'VueFinalModal',
    key: '$vfm',    
    dynamicContainerName: 'ModalsContainer'
}))
```

## `componentName`

- 型別： `String`
- 預設： `'VueFinalModal'`

自定義想要的元件名稱，預設為 `VueFinalModal`。

## `key`

- 型別： `String`
- 預設： `'$vfm'`

自定義存取 API 的 key，預設為 `$vfm`。
<alert>如果建立了多個 `VueFinalModal` 實例，像是 spinner、toast、notify 等，這將會非常有幫助。</alert>

## `dynamicContainerName`

- 型別： `String`
- 預設： `'ModalsContainer'`

自定義動態 modals 容器元件名稱，預設為 `ModalsContainer`。
