---
title: Introduction
description: ''
position: 1
category: Getting Start
---

## Installation

Simple to use, stackable, attachable, highly customizable, mobile-friendly Vue.js 2.0+ modal with SSR support.

`vue-final-modal` has no predefined styles.
There are only three classes inside `vue-final-modal`, including `.vfm__containter`, `.vfm__content`, `.vfm__overlay`. These classes have only the necessary styles and you can still easily override these styles through these props: `classes`, `content-class`, `overlay-class`

Here is the simplified template of entire vue-final-modal

```html[HTML]
<div class="vfm">
  <div class="vfm__overlay">
  <div class="vfm__container">
    <div class="vfm__content">
      <slot />
    </div>
  </div>
</div>
```
