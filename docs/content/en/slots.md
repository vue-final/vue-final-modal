---
title: Slots
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 4
category: Getting Start
---

## All slots

### `content-before`

inject an element before `content` slot.

### `content`

inject an element has class `vfm__content` by default.

### `default`

content of Modal inside slot `content`.

### `content-after`

inject an element after `content` slot.


## Template structure:

```html
<div class="vfm__container">
  <slot name="content-before" />
  <slot name="content">
    <div class="vfm__content">
      <slot />
    </div>
  </slot>
  <slot name="content-after" />
</div>
```