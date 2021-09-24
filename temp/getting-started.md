## Installation

Install `pinia` with your favorite package manager:

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

## Import base on your needs

Checkout:
- [$vfm](/reference/api) for using $vfm API.
- [VueFinalModal](/hoc) for using basic modal component.
- [useModal](/guide/dynamic-modal) is a composition API for define a dynamic modal.
- [ModalsContainer](/guide/dynamic-modal) is the container for using dynamic modal.

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

## CDN

<!-- <alert> -->
[Live demo](https://codepen.io/hunterliu1003/pen/OJmNxmB)
<!-- </alert> -->

- **jsDelivr**

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal@next"></script>
```

- **Unpkg**

```html
<script src="https://unpkg.com/vue-final-modal@next"></script>
```
