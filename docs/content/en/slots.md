---
title: Slots
description: ''
position: 4
category: Getting Start
---

## Slots

| Name         | Description |
| ---          | --- |
| content-before  | inject an element before `content` slot |
| content  | inject an element has class `vfm__content` by default |
| -  | content of Modal inside slot `content` |
| content-after  | inject an element after `content` slot |

### Here is template structure:

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