<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { ModalsContainer, useModal, vfm } from '../'
import VueFinalModal from './VueFinalModal.vue'
import Test from './Test.vue'

const show = ref(false)

async function createUseModalComponent() {
  const modal = useModal({
    bind: {},
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

  await modal.show()
  setTimeout(() => {
    modal.hide()
  }, 2000)
}
async function createUseModalString() {
  const modal = useModal({ slots: { default: 'test' } })
  modal.show()
}

function toggleByName(name: string) {
  vfm.toggle(name)?.then((res) => {
    console.log('res → ', res)
  }).catch((err) => {
    console.log('err → ', err)
  })
}
function hideAll() {
  vfm.hideAll().then((res) => {
    console.log('hideAll → ', res)
  })
}
</script>

<template>
  <div>
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
    <button @click="hideAll">
      Hide All
    </button>
    <VueFinalModal v-model="show" name="ModalName" :disabled-teleport="false" :hide-overlay="true">
      <div>Direct use vfm</div>
      <button @click="show = false">
        close
      </button>
    </VueFinalModal>
  </div>
  <ModalsContainer />
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
