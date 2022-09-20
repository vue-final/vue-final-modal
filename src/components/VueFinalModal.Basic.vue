<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { ModalsContainer, useModal, vfm } from '../'
import VueFinalModal from './VueFinalModal.vue'
import Test from './Test.vue'
// import { useComponent } from './useComponent'

// useComponent()
// useComponent()

const show = ref(false)

async function createModal() {
  const modal = useModal({
    bind: {

    },
    on: {
      beforeOpen(e) {
        // e.stop()
      },
      beforeClose(e) {
        // e.stop()
      },
    },
    slots: {
      // default: 'test',
      default: {
        //
        component: markRaw(Test),
        bind: { text: '123' },
        on: {
          onCreate() {
            console.log('onCreated')
          },
        },
      },
    },
  })

  try {
    await modal.show()
    console.log('success')
    setTimeout(() => {
      // modal.hide()
    })
  }
  catch (e) {
    console.log('fail', e)
  }
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
    <button @click="() => createModal()">
      create modal
    </button>
    <button @click="() => toggleByName('ModalName')">
      open modal by modal name
    </button>
    <button @click="hideAll">
      Hide All
    </button>
    <VueFinalModal name="ModalName" :disabled-teleport="false">
      <div>Direct use vfm</div>
    </VueFinalModal>
  </div>
  <ModalsContainer />
</template>

<docs lang="md">
### Markdown docs for Basic example
</docs>
