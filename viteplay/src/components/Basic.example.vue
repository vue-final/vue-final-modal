<script setup lang="ts">
import { ref } from 'vue'
import { ModalsContainer, VueFinalModal, defineTemplate as _h, useModal, useVfm } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'
import { modal } from './modalsHelpers'
import TestModal from './TestModal.vue'

console.log('modal → ', modal)

const { toggle, closeAll } = useVfm()
modal.open().then((res) => { console.log('res', res) })
modal.open().then((res) => { console.log('res', res) })
modal.open().then((res) => { console.log('res', res) })
modal.open().then((res) => { console.log('res', res) })
const modal1 = useModal({
  component: VueFinalModal,
  attrs: {
    // 'displayDirective': 'if',
    'background': 'interactive',
    'lockScroll': false,
    'contentStyle': { backgroundColor: '#fff' },
    'onUpdate:modelValue': function (val) {
      console.log('onUpdate:modelValue', val)
    },
    'contentTransition': 'vfm-fade',
    'overlayTransition': 'vfm-fade',
    onClosed() { console.log('onClosed') },
    onBeforeClose() { console.log('onBeforeClose') },
    onOpened() { console.log('onOpened') },
    onBeforeOpen() { console.log('onBeforeOpen') },
  },
  slots: {
    default: _h({
      component: DefaultSlot,
      attrs: {
        text: '123',
        onClose: () => modal1.close(),
      },
      slots: {
        default: _h({
          component: DefaultSlot,
          attrs: {
            text: '456',
            onClose: () => modal1.close(),
          },
          slots: {
            default: _h({
              component: DefaultSlot,
              attrs: {
                text: '789',
                onClose: () => modal1.close(),
              },
            }),
          },
        }),
      },
    }),
  },
})

const modal2 = useModal({
  component: VueFinalModal,
  attrs: {
    displayDirective: 'if',
    background: 'interactive',
  },
  slots: {
    default: 'test',
  },
})

const show = ref(false)
const lockScroll = ref(false)
const reserveScrollBarGap = ref(false)
const theModalId = Symbol('theModalId')

function beforeOpen() {
  console.log('beforeOpen')
}
function clickOutside() {
  console.log('clickOutside')
}

// onMounted(() => {
//   show.value = true
// })

// const { show: _show } = useTemplate({
// component: () => h('div', null, 'test'),
// attrs: {
//   text: 'useTemplate',
// },
// slots: {
//   default: h({
//     component: DefaultSlot,
//     attrs: {
//       text: '123456',
//     },
//   }),
// },
// slots: {
//   default: h({
//     component: DefaultSlot,
//     attrs: {
//       text: '456',
//     },
//     slots: {
//       default: h({
//         component: DefaultSlot,
//         attrs: {
//           text: '789',
//         },
//       }),
//     },
//   }),
// },
// })

// _show()
</script>

<template>
  <div>
    <div style="padding-top: 100px">
      <button @click="lockScroll = !lockScroll">
        toggle lockScroll: {{ lockScroll }}
      </button>
      <button @click="reserveScrollBarGap = !reserveScrollBarGap">
        toggle reserveScrollBarGap: {{ reserveScrollBarGap }}
      </button>
      <button @click="show = !show">
        show vfm
      </button>
      <button @click="() => toggle(theModalId)">
        show modal by modal modalId
      </button>
      <button @click="() => modal1.open()">
        create modal component
      </button>
      <button @click="() => modal2.open()">
        create modal string
      </button>
      <button @click="closeAll">
        Hide All
      </button>

      <TestModal
        v-model="show" :modal-id="theModalId" class="test-vfm" :teleport-to="false" :lock-scroll="lockScroll"
        :reserve-scroll-bar-gap="reserveScrollBarGap" display-directive="show" :click-to-hide="true"
        content-transition="vfm-fade" overlay-transition="vfm-fade" background="interactive" @before-show="beforeOpen"
        @click-outside="clickOutside"
      >
        <div>Direct use vfm</div>
        <button @click="() => toggle(theModalId)">
          hide modal by modal modalId
        </button>
        <button @click="show = false">
          hide
        </button>
      </TestModal>
      <div v-for="i in 1000" :key="i">
        test: {{ i }}
      </div>
    </div>
    <ModalsContainer />
  </div>
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
