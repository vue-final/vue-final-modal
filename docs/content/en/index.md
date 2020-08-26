---
title: Introduction
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
position: 0
category: Getting Start
features:
  - Tailwind CSS friendly
  - Renderless component
  - SSR support
  - Stackable
  - Detachable
  - Scrollable
  - Transition support
  - Mobile friendly
  - 3.2kb gzipped
---

<img src="https://hunterliu1003.github.io/assets/gifs/vue-final-modal.gif" />

<p class="flex space-x-4">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true"><img class="m-0" src="https://img.shields.io/npm/dm/vue-final-modal.svg?sanitize=true" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img class="m-0" src="https://badgen.net/bundlephobia/minzip/vue-final-modal" alt="Size"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img class="m-0" src="https://img.shields.io/npm/v/vue-final-modal.svg?sanitize=true" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img class="m-0" src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License"></a>
</p>

[Vue Final Modal](https://github.com/hunterliu1003/vue-final-modal) is a customizable, stackable, detachable and lightweight modal component.

## Features

<list :items="features"></list>

<p class="flex items-center">Enjoy light and dark mode:&nbsp;<app-color-switcher class="p-2"></app-color-switcher></p>

## HTML structure

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


## Styles

`vue-final-modal` has no predefined style.
There are main classes:
- `.vfm__overlay`: `rgba(0, 0, 0, 0.5)` black background 
- `.vfm__containter`
- `.vfm__content`

The above classes only have the necessary style and you can easily override through these [properties](/properties): 
- `classes`
- `content-class`
- `overlay-class`
