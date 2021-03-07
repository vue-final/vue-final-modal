---
title: 'Introduction'
description: 'Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.'
category: ''
position: 0
features:
  - Support Vue 3, Vue 2 and Nuxt
  - Tailwind CSS friendly
  - Renderless component
  - Tiny bundle size
  - Support stackable, detachable, scrollable, transition, accessibility, focusTrap, dynamic modal
---

<img src="/preview.png" class="light-img" alt="Vue Final Modal Logo" />
<img src="/preview-dark.png" class="dark-img" alt="Vue Final Modal Logo" />

<p class="flex h-8 space-x-4">
  <a href="https://npmcharts.com/compare/vue-final-modal?minimal=true"><img src="https://badgen.net/npm/dm/vue-final-modal" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://img.shields.io/npm/l/vue-final-modal.svg?sanitize=true" alt="License"></a>
  <a href="https://app.netlify.com/sites/vue-final-modal/deploys"><img src="https://api.netlify.com/api/v1/badges/444b13a8-540f-4438-94da-80c865c8f103/deploy-status" alt="Netlify Status"></a>
</p>

<p class="flex h-8 space-x-4">
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/npm/v/vue-final-modal" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/master/dist/VueFinalModal.umd.js" alt="Size"></a>
  <a href='https://coveralls.io/github/vue-final/vue-final-modal?branch=master'><img src='https://coveralls.io/repos/github/vue-final/vue-final-modal/badge.svg?branch=master' alt='Coverage Status' /></a>
</p>

<p class="flex h-8 space-x-4">
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/npm/v/vue-final-modal/next" alt="Version"></a>
  <a href="https://www.npmjs.com/package/vue-final-modal"><img src="https://badgen.net/badgesize/brotli/hunterliu1003/vue-final-modal/next/dist/VueFinalModal.umd.js" alt="Size"></a>
  <a href='https://coveralls.io/github/vue-final/vue-final-modal?branch=next'><img src='https://coveralls.io/repos/github/vue-final/vue-final-modal/badge.svg?branch=next' alt='Coverage Status' /></a>
</p>

<p align="right">
  <a href="https://www.buymeacoffee.com/PL2qJIx" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" >
  </a>
</p>

[Vue Final Modal](https://github.com/hunterliu1003/vue-final-modal) is a tiny, renderless, mobile-friendly, feature-rich modal component for Vue.js.<br />
You can create a [higher-order component](/examples/recommend) easily and can customize `template`, `script` and `style` based on your needs.

## Features

<list :items="features"></list>

<p class="flex items-center">Enjoy light and dark mode:&nbsp;<app-color-switcher class="p-2"></app-color-switcher></p>

## **Development**

```bash
# Clone repo
git clone https://github.com/vue-final/vue-final-modal.git

# Run linter
yarn lint

# Run unit test
yarn test

# Build library
yarn
yarn build

# Run examples
cd examples
yarn
yarn serve

# Run docs
cd docs
yarn
yarn dev
```

## **Contribution**

Thank you to all the people who already contributed to `vue-final-modal`!

<a href="https://github.com/vue-final/vue-final-modal/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=vue-final/vue-final-modal" />
</a>

Made with [contributors-img](https://contrib.rocks).

To develop `vue-final-modal`, I learn a lot from these awesome libraries:

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

<alert>There is no perfect library even the `final` of vue modal.</alert>

<alert>

🚀 If you have any ideas for optimization of `vue-final-modal`, feel free to open [issues](https://github.com/hunterliu1003/vue-final-modal/issues) or [pull requests](https://github.com/hunterliu1003/vue-final-modal/pulls).

</alert>
