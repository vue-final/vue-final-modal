---
title: Params
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 6
category: Guide
fullscreen: true
---

When you open a modal though the [API](/api) `$vfm.show(name, params)`.

## You have two ways to get `params`:

### Use `scoped-slot`

```html
<template v-slot="{ params }">
  <!-- modal content -->
</template>
```

### On `@beforeOpen` event

```html
<vue-final-modal @beforeOpen="event => event.ref.params">
  <!-- modal content -->
</vue-final-modal>
```

<alert>`params` will be reset to `{}` automatically after [`closed`](/guide/events#closed) event. You can avoid the modal to reset the `params` to empty object by calling `event.stop()`.</alert>
