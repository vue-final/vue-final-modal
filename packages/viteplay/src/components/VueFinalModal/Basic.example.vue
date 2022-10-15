<script setup lang="ts">
import { markRaw, ref } from 'vue'
import type { ModalId, VueFinalModal } from 'vue-final-modal'
import { ModalsContainer, useModal, vfm } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'
import TestModal from './TestModal.vue'

async function openNewModal() {
  const modal = useModal<
    InstanceType<typeof VueFinalModal>['$props'],
    InstanceType<typeof DefaultSlot>['$props']
  >({
    attrs: {
      'displayDirective': 'if',
      'background': 'interactive',
      'lockScroll': false,
      'contentStyle': { backgroundColor: '#fff' },
      'onUpdate:modelValue': function (val) {
        // console.log('onUpdate:modelValue', val)
      },
      onClosed() { console.log('onClosed') },
      onBeforeClose() { console.log('onBeforeClose') },
      onOpened() { console.log('onOpened') },
      onBeforeOpen() { console.log('onBeforeOpen') },
    },
    slots: {
      default: {
        component: markRaw(DefaultSlot),
        attrs: {
          text: '123',
          onCreate() {
            // console.log('onCreated')
          },
        },
      },
    },
  })
  return modal.open().then(() => {
    console.log('opened')
  })
}

async function openNewModalString() {
  const modal = useModal<
    InstanceType<typeof VueFinalModal>['$props']
  >({
    attrs: {
      displayDirective: 'if',
      background: 'interactive',
    },
    slots: {
      default: 'test',
    },
  })
  return await modal.open()
}

function toggle(modalId: ModalId) {
  vfm.toggle(modalId)
  // ?.then((res) => {
  //   console.log('res → ', res)
  // }).catch((err) => {
  //   console.log('err → ', err)
  // })
}
function closeAll() {
  vfm.closeAll()
  // .then((res) => {
  //   console.log('closeAll → ', res)
  // })
}

const show = ref(false)
const lockScroll = ref(false)
const theModalId = Symbol('theModalId')

function beforeOpen() {
  console.log('beforeOpen')
}
function clickOutside() {
  console.log('clickOutside')
}
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="lockScroll = !lockScroll">
      toggle lockScroll: {{ lockScroll }}
    </button>
    <button @click="show = !show">
      open vfm
    </button>
    <button @click="() => toggle(theModalId)">
      open modal by modal modalId
    </button>
    <button @click="() => openNewModal()">
      create modal component
    </button>
    <button @click="() => openNewModalString()">
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
      display-directive="show"
      :click-to-close="true"
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
