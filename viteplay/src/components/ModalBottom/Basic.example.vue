<script setup lang="ts">
import { ref } from 'vue'
import { ModalBottom, ModalsContainer, useModal, useModalSlot, useVfm } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

const show = ref(false)
const theModalId = Symbol('theModalId')

const { toggle } = useVfm()

const bottomSheet = useModal({
  component: ModalBottom,
  attrs: {
    background: 'interactive',
    contentStyle: {
      backgroundColor: '#fff',
    },
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

function beforeOpen(e: any) {
  console.log('beforeOpen', e)
}
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="show = !show">
      open vfm
    </button>
    <button @click="() => toggle(theModalId)">
      open modal by modal modalId
    </button>
    <button @click="() => bottomSheet.open()">
      create bottom sheet component
    </button>
    <ModalBottom
      v-model="show"
      :modal-id="theModalId"
      content-style="background-color: #fff; border-top-left-radius: 12px; border-top-right-radius: 12px;"
      @before-open="beforeOpen"
    >
      <div>Direct use vfm</div>
      <button @click="() => toggle(theModalId)">
        close modal by modal modalId
      </button>
      <button @click="show = false">
        close
      </button>
      <div style="height: 300px">
        Direct use vfm
      </div>
      <!-- <div style="min-height: 500px">
        Direct use vfm
      </div>
      <div style="min-height: 500px">
        Direct use vfm
      </div> -->
    </ModalBottom>
  </div>

  <div v-for="i in 1000" :key="i">
    test: {{ i }}
  </div>

  <ModalsContainer />
</template>
