---
title: '介紹'
description: 'Vue Final Modal 是一個無渲染、可堆疊、可拆卸且輕巧的 modal 元件。'
position: 0
fullscreen: true
features:
  - 支援 Vue 3、Vue 2 與 Nuxt
  - Tailwind CSS 友好
  - 無渲染元件
  - 極小的打包尺寸
  - 支援 modal 堆疊、可拆卸、可滾動、可拖曳、可調整大小的 modal、過度效果、無障礙、焦點鎖定、動態 modal
version: 3
---

<img src="/preview.png" class="light-img" alt="Vue Final Modal Logo" />
<img src="/preview-dark.png" class="dark-img" alt="Vue Final Modal Logo" />

<p class="flex h-8 space-x-4">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true">
    <img src="https://badgen.net/npm/dm/vue-final-modal" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/vue-final-modal">
    <img src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License">
  </a>
  <a href="https://app.netlify.com/sites/vue-final-modal/deploys">
    <img src="https://api.netlify.com/api/v1/badges/444b13a8-540f-4438-94da-80c865c8f103/deploy-status" alt="Netlify Status">
  </a>
</p>

<p class="flex h-8 space-x-4">
  <a href="https://www.npmjs.com/package/vue-final-modal">
    <img src="https://badgen.net/npm/v/vue-final-modal/legacy" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/vue-final-modal">
    <img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/v2/dist/VueFinalModal.umd.js" alt="Size">
  </a>
  <a href='https://coveralls.io/github/vue-final/vue-final-modal?branch=v2'><img src='https://coveralls.io/repos/github/vue-final/vue-final-modal/badge.svg?branch=v2' alt='Coverage Status' /></a>
</p>

<p class="flex h-8 space-x-4">
  <a href="https://www.npmjs.com/package/vue-final-modal">
    <img src="https://badgen.net/npm/v/vue-final-modal/latest" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/vue-final-modal">
    <img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/master/dist/VueFinalModal.umd.js" alt="Size">
  </a>
  <a href='https://coveralls.io/github/vue-final/vue-final-modal?branch=master'><img src='https://coveralls.io/repos/github/vue-final/vue-final-modal/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

<p align="right">
  <a href="https://www.buymeacoffee.com/PL2qJIx" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</p>

[Vue Final Modal](https://github.com/hunterliu1003/vue-final-modal) 是一個輕量、無渲染、對行動裝置友善並且功能豐富的 Vue.js modal 元件。

你可以很輕鬆地製作出一個 [高階元件（Higher-Order Components）](/zh-Hant/examples/recommend)並且依照不同的需求客製元件的內容。

## Vue Final Modal 4.0 has been released for Vue 3 🚀

Checkout the new documentation: [https://v4.vue-final-modal.org/](https://v4.vue-final-modal.org/)

## Looking for a Vue 2 version? [It's over here](https://v2.vue-final-modal.org)

## Features

<list :items="features"></list>

<p class="flex items-center">切換你想要的色彩模式：&nbsp;<app-color-switcher class="p-2"></app-color-switcher></p>

## **開發**

```bash
# Clone repo
git clone https://github.com/vue-final/vue-final-modal.git

# Run linter
yarn lint

# Build library
yarn
yarn build

# Run examples
cd examples
yarn
yarn dev

# Run docs
cd docs
yarn
yarn dev
```

## **貢獻**

👋 嗨！我是 Hunter，`vue-final-modal` 的作者。

在開發 `vue-final-modal` 過程中，從這些很棒的 libraries 中學習到很多：

- [Vuetify](https://vuetifyjs.com/en/)
  - attach
- [Element UI](https://element.eleme.io/)
  - stackable modal
  - zIndex
  - zIndexBase
- [vue-js-modal](https://github.com/euvl/vue-js-modal)
  - dynamic modal
  - transition
  - focusTrap for A11y
- [body-scroll-lock](https://github.com/willmcpo/body-scroll-lock)
  - lockScroll
- [vue-resizable](https://github.com/nikitasnv/vue-resizable)
  - drag & resize
  
<alert>沒有 library 是完美的，就算是這個 Vue 的 `final` modal</alert>

<alert>

🚀 如果你有任何想法可以讓 `vue-final-modal` 變得更好，歡迎隨時打開一個 [issues](https://github.com/hunterliu1003/vue-final-modal/issues) 給我或是發個 [pull requests](https://github.com/hunterliu1003/vue-final-modal/pulls)。

</alert>