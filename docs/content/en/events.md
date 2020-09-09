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