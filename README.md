# vue-final-modal

## Demo

https://hunterliu1003.github.io/vue-final-modal/

## Usage

```
yarn add vue-final-modal
```

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