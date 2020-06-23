# vue-final-modal

## Introduction

Simple to use, highly customizable, mobile-friendly Vue.js 2.0+ modal with SSR support. https://hunterliu1003.github.io/vue-final-modal/

## Demo

https://hunterliu1003.github.io/vue-final-modal/

## Install

NPM:
```bash
npm install vue-final-modal --save
```

Yarn: 

```bash
yarn add vue-final-modal
```

## CDN

https://www.jsdelivr.com/package/npm/vue-final-modal

UMD builds can be used directly in the browser via a `<script>` tag. 

```html
<script src="https://cdn.jsdelivr.net/npm/vue-final-modal@0.2.1/lib/vue-final-modal.umd.min.js"></script>
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

## Tailwind

## Modal

## Dynamic Modals

## Toast

## Notiflication

## Spinner

## SSR

## Properties

| Name | Type | Required | Default | Description |
| ---  | ---  | ---      | ---     | ---         |
| class | [String, Object, Array] | --- | '' | custom class names for Modal container element |
| contentClass | [String, Object, Array] | --- | '' | custom class names for Modal content element |
| lockScroll | Boolean | --- | true | whether scroll of body is disabled while Dialog is displayed |
| hideOverlay | Boolean | --- | false | Hides the display of the overlay. |
| clickToClose | Boolean | --- | true | Clicking outside of the element will not close Modal. |
| preventClick | Boolean | --- | false | The click event will not be blocked by overlay |
| overlayClass | String | --- | '' | Add classes to the overlay element. |
| attach | any | --- | 'body' | Specifies which DOM element that this component should detach to. Set `false` will disabled this feature. String can be any valid querySelector and Object can be any valid Node.  This will attach to the <body> element by default. |

### Slots

| Name         | Description |
| ---          | --- |
| content-before  | inject an element before `content` slot |
| content  | inject an element has class `vfm__content` by default |
| -  | content of Modal inside slot `content` |
| content-after  | inject an element after `content` slot |

#### Here is template structure:

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

## Roadmap

- draggable modal
- transition
- scrollable
- resizable
- appendToElement and set customize z-index prop
- duplicate overlay prop
- dynamic emit modal component with vue directive like:
  - `this.$modal.show('hello-world')`
  - `this.$modal.hide('hello-world')`
