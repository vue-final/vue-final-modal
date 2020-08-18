---
title: Events
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 3
category: Getting Start
---

## `@before-open`

Emits while modal is still invisible, but before transition starting.

## `@opened`

Emits after modal became visible and transition ended. 

## `@before-close`

Emits before modal is going to be closed. 

## `@closed`

Emits right before modal is destroyed.

## Examples

<base-example-events></base-example-events>

```html[SFC]
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
      @before-open="beforeOpen"
      @opened="opened"
      @before-close="beforeClose"
      @closed="closed"
    >
      <span class="text-2xl mb-2">Events Example!</span>
    </vue-final-modal>
    <base-button @click="showModal = true">Events Example!</base-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  }),
  methods: {
    beforeOpen() {
      alert('beforeOpen')
    },
    opened() {
      alert('opened')
    },
    beforeClose() {
      alert('beforeClose')
    },
    closed() {
      alert('closed')
    }
  }
}
</script>
```