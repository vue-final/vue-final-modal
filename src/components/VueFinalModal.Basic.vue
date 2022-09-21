<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { ModalsContainer, useModal, vfm } from '../'
import VueFinalModal from './VueFinalModal.vue'
import Test from './Test.vue'

const show = ref(false)
const lockScroll = ref(false)

async function createUseModalComponent() {
  const modal = useModal({
    bind: { nonModal: true, lockScroll: false },
    on: {
      beforeOpen(e) {
        // e.stop()
      },
      beforeClose(e) {
        // e.stop()
      },
    },
    slots: {
      default: {
        component: markRaw(Test),
        bind: { text: '123' },
        on: { onCreate() { console.log('onCreated') } },
      },
    },
  })

  await modal.open()
  setTimeout(() => {
    // modal.close()
  }, 2000)
}
async function createUseModalString() {
  const modal = useModal({ bind: { nonModal: true }, slots: { default: 'test' } })
  modal.open()
}

function toggleByName(name: string) {
  vfm.toggle(name)?.then((res) => {
    console.log('res → ', res)
  }).catch((err) => {
    console.log('err → ', err)
  })
}
function closeAll() {
  vfm.closeAll().then((res) => {
    console.log('closeAll → ', res)
  })
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
    <button @click="() => toggleByName('ModalName')">
      open modal by modal name
    </button>
    <button @click="() => createUseModalComponent()">
      create modal component
    </button>
    <button @click="() => createUseModalString()">
      create modal string
    </button>
    <button @click="closeAll">
      Hide All
    </button>
    <VueFinalModal v-model="show" name="ModalName" :disabled-teleport="false" :lock-scroll="lockScroll" :non-modal="true" @before-open="e => e.stop()">
      <div>Direct use vfm</div>
      <button @click="() => toggleByName('ModalName')">
        close modal by modal name
      </button>
      <button @click="show = false">
        close
      </button>
    </VueFinalModal>
    <div v-for="i in 1000" :key="i">
      asdf: {{ i }}
    </div>
  </div>
  <ModalsContainer />
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
