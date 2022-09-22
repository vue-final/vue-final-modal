<script setup lang="ts">
import { markRaw, ref } from 'vue'
import type { ModalId } from '../'
import { ModalsContainer, useModal, vfm } from '../'
import VueFinalModal from './VueFinalModal.vue'
import Test from './Test.vue'

const show = ref(false)
const lockScroll = ref(false)
const theModalId = Symbol('theModalId')

async function openNewModal() {
  const modal = useModal({
    bind: {
      nonModal: true,
      lockScroll: false,
      contentStyle: { backgroundColor: '#fff' },
    },
    on: {
      // beforeOpen(e) { e.stop() },
      // beforeClose(e) { e.stop() },
    },
    slots: {
      default: {
        component: markRaw(Test),
        bind: { text: '123' },
        on: {
          onCreate() { console.log('onCreated') },
        },
      },
    },
  })

  return await modal.open()
}

async function openNewModalString() {
  const modal = useModal({
    bind: {
      nonModal: true,
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

    <VueFinalModal v-model="show" :modal-id="theModalId" :disabled-teleport="false" :lock-scroll="lockScroll" :non-modal="true">
      <div>Direct use vfm</div>
      <button @click="() => toggle(theModalId)">
        close modal by modal modalId
      </button>
      <button @click="show = false">
        close
      </button>
    </VueFinalModal>
    <div v-for="i in 1000" :key="i">
      test: {{ i }}
    </div>
  </div>

  <ModalsContainer />
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
