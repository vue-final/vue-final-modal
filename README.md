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
| boxClass | [String, Object, Array] | --- | '' | custom class names for Modal box element |
| lockScroll | Boolean | --- | true | whether scroll of body is disabled while Dialog is displayed |
| hideOverlay | Boolean | --- | false | Hides the display of the overlay. |
| clickToClose | Boolean | --- | true | Clicking outside of the element will not close Modal. |
| preventClick | Boolean | --- | false | The click event will not be blocked by overlay |
| overlayClass | String | --- | '' | Add classes to the overlay element. |
| attach | any | --- | false | Specifies which DOM element that this component should detach to. String can be any valid querySelector and Object can be any valid Node. This will attach to the <body> element by default. |

### Slots

| Name         | Description |
| ---          | --- |
| box-before  | inject an element before `box` slot |
| box  | inject an element has class `vfm__box` by default |
| -  | content of Modal inside slot `box` |
| box-after  | inject an element after `box` slot |

#### Here is template structure:

```html
<div class="vfm__container">
  <slot name="box-before" />
  <slot name="box">
    <div class="vfm__box">
      <slot />
    </div>
  </slot>
  <slot name="box-after" />
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
