# Params

When you open a modal by [\$vfm.show(name, params)](/reference/api#vfm-show-name-params), [useModal hook](/reference/dynamic-modal#usemodal-hook).

## Two functions to pass params

### $vfm.show(name, params)

```js
import { $vfm } from 'vue-final-modal'

// open basic modal
$vfm.show('ModalName', {
  /** ...params */
})

// open dynamic modal
$vfm.show({
  component: 'VModal',
  params: {
    // ...
  }
})
```

### useModal hook

```js
import { useModal } from 'vue-final-modal'

useModal({
  params: {
    // ...
  }
})
```

## Two ways to get `params`:

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

:::info
`params` will be reset to `{}` automatically after [`closed`](/reference/events#closed) event. You can avoid the modal to reset the `params` to empty object by calling `event.stop()`.
:::
