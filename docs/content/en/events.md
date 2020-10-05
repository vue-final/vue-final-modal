---
title: Events
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 3
category: Getting Start
version: 0.14
---

## All events

### `@click-outside`

<badge>v0.14+</badge>

Emits while modal container on click.

<alert>

If prop `clickToClose` is `false`, the event will still be emitted.

</alert>

### `@before-open`

Emits while modal is still invisible, but before transition starting.

### `@opened`

Emits after modal became visible and transition ended. 

### `@before-close`

Emits before modal is going to be closed. 

### `@closed`

Emits right before modal is destroyed.

## Examples

<tailwind-events></tailwind-events>

<show-code open class="pt-4">

```html
<template>
    <vue-final-modal
      @before-open="beforeOpen"
      @opened="opened"
      @before-close="beforeClose"
      @closed="closed"
    >
      ...modal content
    </vue-final-modal>
</template>
```

</show-code>