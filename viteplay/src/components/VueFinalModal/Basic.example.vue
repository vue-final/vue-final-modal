<script setup lang="ts">
import { ref } from 'vue'
import { ModalsContainer, VueFinalModal, useModal, useModalSlot, useVfm } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'
import { modal } from './modalsHelpers'
import TestModal from './TestModal.vue'

console.log('modal → ', modal)

const { toggle, closeAll } = useVfm()
modal.open().then((res) => { console.log('res', res) })
modal.open().then((res) => { console.log('res', res) })
modal.open().then((res) => { console.log('res', res) })
modal.open().then((res) => { console.log('res', res) })
const modal1 = useModal({
  keepAlive: true,
  attrs: {
    // 'displayDirective': 'if',
    'background': 'interactive',
    'lockScroll': false,
    'contentStyle': { backgroundColor: '#fff' },
    'onUpdate:modelValue': function (val) {
      console.log('onUpdate:modelValue', val)
    },
    onClosed() { console.log('onClosed') },
    onBeforeClose() { console.log('onBeforeClose') },
    onOpened() { console.log('onOpened') },
    onBeforeOpen() { console.log('onBeforeOpen') },
  },
  slots: {
    default: useModalSlot({
      component: DefaultSlot,
      attrs: {
        text: '123',
        onCreate() {
          // console.log('onCreated')
        },
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
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="lockScroll = !lockScroll">
      toggle lockScroll: {{ lockScroll }}
    </button>
    <button @click="reserveScrollBarGap = !reserveScrollBarGap">
      toggle reserveScrollBarGap: {{ reserveScrollBarGap }}
    </button>
    <button @click="show = !show">
      open vfm
    </button>
    <button @click="() => toggle(theModalId)">
      open modal by modal modalId
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
      v-model="show"
      :modal-id="theModalId"
      class="test-vfm"
      :teleport-to="false"
      :lock-scroll="lockScroll"
      :reserve-scroll-bar-gap="reserveScrollBarGap"
      display-directive="show"
      :click-to-close="true"
      content-transition="vfm-fade"
      overlay-transition="vfm-fade"
      background="interactive"
      @before-open="beforeOpen"
      @click-outside="clickOutside"
    >
      <div>Direct use vfm</div>
      <button @click="() => toggle(theModalId)">
        close modal by modal modalId
      </button>
      <button @click="show = false">
        close
      </button>
    </TestModal>
    <div v-for="i in 1000" :key="i">
      test: {{ i }}
    </div>
  </div>

  <ModalsContainer />
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
