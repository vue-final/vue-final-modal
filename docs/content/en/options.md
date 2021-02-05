---
title: Options
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: Getting started
position: 2
---

Options can be passed as a second argument to `Vue.use`.

```js
import VueFinalModal from 'vue-final-modal'

Vue.use(VueFinalModal(), { 
    componentName: 'VueFinalModal',
    key: '$vfm',    
    dynamicContainerName: 'ModalsContainer'
})
```

## `componentName`

- Type: `String`
- default: `'VueFinalModal'`

Customize component name from `VueFinalModal` to any other string value.

## `key`

- Type: `String`
- default: `'$vfm'`

Customize API name from `$vfm` to any other string value. 
<alert>It is useful when you create multiple instance of  `VueFinalModal` as spinner, toast, notify, etc.</alert>

## `dynamicContainerName`

- Type: `String`
- default: `'ModalsContainer'`

Customize dynamic modals container name from `ModalsContainer` to any other string value.
