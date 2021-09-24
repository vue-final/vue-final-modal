# Getting Started

## Installation

Install `vue-final-modal` with your favorite package manager:

```bash
pnpm add vue-final-modal@next
# or with yarn
yarn add vue-final-modal@next
# or with npm
npm install vue-final-modal@next
```

:::tip
`vue-final-modal@next` install Vue Final Modal v3 for Vue 3. If your app is using Vue 2, you need to install Vue Final Modal v2: `vue-final-modal@latest`.
:::

VFM consists of three parts:

## `$vfm`

APIs for control modal components.

## `VueFinalModal`

The modal component.

## `useModal`, `ModalsContainer`

Using `$vfm API` or `useModal hook` to generate a dynamic modal and the modal will be rendered in `ModalsContainer`.


```vue
<script>
import { $vfm, VueFinalModal, useModal, ModalsContainer } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal,
    ModalsContainer
  }
}
</script>
```
