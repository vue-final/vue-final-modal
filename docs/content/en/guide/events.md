---
title: Events
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: Guide
position: 5
version: 2
---

**Example**:

<v-events class="mb-4"></v-events>

<sfc-view>

```vue
<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      @click-outside="clickOutside"
      @before-open="beforeOpen"
      @opened="opened"
      @before-close="beforeClose"
      @closed="closed"
      @cancel="showModal = false"
    >
      <template v-slot:title>Events Example!</template>
    </vue-final-modal>
    <v-button highlight @click="showModal = true">Open modal</v-button>
  </div>
</template>
```

```vue
<script>
export default {
  data: () => ({
    showModal: false
  }),
  methods: {
    clickOutside() {
      alert('click-outside')
    },
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

</sfc-view>

## `@click-outside`

Emits while modal container on click.

<alert>

If prop [`clickToClose`](/guide/properties#clicktoclose) is `false`, the event will still be emitted.

</alert>

## `@before-open`

Emits while modal is still invisible, but before transition starting.

<alert>Further opening of the modal can be blocked from this event listener by calling `event.stop()`.</alert>

## `@opened`

Emits after modal became visible and transition ended.

## `@before-close`

Emits before modal is going to be closed.

<alert>Further closing of the modal can be blocked from this event listener by calling `event.stop()`.</alert>

## `@closed`

Emits right before modal is destroyed.

<alert>Further after the modal was closed, you can avoid the modal to reset the [`params`](/guide/params) to empty object by calling `event.stop()`.</alert>

## `@drag:start`

Emits on drag start.

## `@drag:move`

Emits on drag move.

## `@drag:end`

Emits on drag end.

## `@resize:start`

Emits on resize start.

## `@resize:move`

Emits on resize move.

## `@resize:end`

Emits on resize end.
