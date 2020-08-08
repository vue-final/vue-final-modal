---
title: Installation
description: ''
position: 1
category: Getting Start
---

## Install

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add vue-final-modal
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install vue-final-modal
  ```

  </code-block>
</code-group>

## CDN

https://www.jsdelivr.com/package/npm/vue-final-modal

UMD builds can be used directly in the browser via a `<script>` tag. 

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal@0.5.2/lib/vue-final-modal.umd.min.js"></script>
```

[codepen example](https://codepen.io/hunterliu1003/pen/PoZmbPm?editors=1010)

## How to use

```html
<button @click="showModal = true">Show modal</button>

<vue-final-modal v-model="showModal">
  <button @click="showModal = false">close modal</button>
</vue-final-modal>
```

```js
import VueFinalModal from 'vue-final-modal'

export default {
  components: {
    VueFinalModal,
  },
  data: () => ({
    showModal: false
  })
}
```


