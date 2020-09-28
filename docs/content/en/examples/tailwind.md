---
title: TailwindCSS
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 2
category: Examples
fullscreen: true
---

See [Tailwind Examples Source Code](https://github.com/hunterliu1003/vue-final-modal/tree/master/example/src/components/tailwind)

## Simple

<tailwind-simple></tailwind-simple>

<show-code>

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
    >
      <span class="text-2xl mb-2">Hello, world!</span>
    </vue-final-modal>
    <button @click="showModal = true">Simple</button>
  </div>
</template>

<script>
  export default {
    data: () => ({
      showModal: false
    })
  }
</script>

<style scoped>
  button {
    @apply mb-2 px-2 py-1 border rounded;
  }
</style>
```

</show-code>

## Set lockScroll to `false`

<tailwind-lock-scroll></tailwind-lock-scroll>

## Hide overlay

<tailwind-hide-overlay></tailwind-hide-overlay>

## Click to close

<tailwind-click-to-close></tailwind-click-to-close>

## Prevent click

<tailwind-prevent-click></tailwind-prevent-click>

## Stackable

<tailwind-stackable></tailwind-stackable>

## Scrollable

<tailwind-scrollable></tailwind-scrollable>

## Detachable

<tailwind-attach></tailwind-attach>

## Custom vue-final-modal component

TBD

## Override style

TBD
