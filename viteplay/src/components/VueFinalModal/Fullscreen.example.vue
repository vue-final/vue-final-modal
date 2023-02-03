<script setup lang="ts">
import { ref } from 'vue'
import { ModalsContainer, VueFinalModal, useModal, useModalSlot, useVfm } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

const show = ref(false)
const theModalId = Symbol('theModalId')
const { toggle } = useVfm()

const fullscreenModal = useModal({
  // component: VueFinalModal,
  attrs: {
    background: 'interactive',
    swipeToClose: 'right',
    showSwipeBanner: true,
    contentStyle: {
      backgroundColor: '#fff',
      width: '100%',
      height: '100%',
    },
  },
  slots: {
    'default': useModalSlot({
      component: DefaultSlot,
      attrs: {
        text: '123',
        onCreate() {
          // console.log('onCreated')
        },
      },
    }),
    'swipe-banner': '<div style="position: absolute; height: 100%; top: 0; left: 0; width: 20px; background-color: pink;" />',
  },
})
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="show = !show">
      open vfm
    </button>
    <button @click="() => toggle(theModalId)">
      open modal by modal modalId
    </button>
    <button @click="() => fullscreenModal.open()">
      create full screen component
    </button>
    <VueFinalModal
      v-model="show"
      :modal-id="theModalId"
      content-style="background-color: #fff; width: 100%; height: 100%"
      :show-swipe-banner="true"
      :prevent-navigation-gestures-on-mobile-webkit="true"
    >
      <template #swipe-banner>
        <div style="position: absolute; height: 100%; top: 0; left: 0; width: 20px; background-color: pink;" />
      </template>
      <div style="height: 500px">
        <div>Direct use vfm</div>
        <button @click="() => toggle(theModalId)">
          close modal by modal modalId
        </button>
        <button @click="show = false">
          close
        </button>
      </div>
      <div style="width: 1000px; height: 500px">
        Direct use vfm
      </div>
      <div style="width: 1000px; height: 500px">
        Direct use vfm
      </div>
      <div style="width: 1000px; height: 500px">
        Direct use vfm
      </div>
    </VueFinalModal>
  </div>

  <div v-for="i in 1000" :key="i">
    test: {{ i }}
  </div>

  <ModalsContainer />
</template>
