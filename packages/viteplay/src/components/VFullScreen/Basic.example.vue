<script setup lang="ts">
import { markRaw, ref } from 'vue'
import type { ModalId } from 'vue-final-modal'
import { ModalsContainer, VFullScreen, useModal, vfm } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

const show = ref(false)
const theModalId = Symbol('theModalId')

function toggle(modalId: ModalId) {
  vfm.toggle(modalId)
}

async function useFullScreen() {
  const modal = useModal<
    InstanceType<typeof VFullScreen>['$props'],
    InstanceType<typeof DefaultSlot>['$props']
  >({
    component: markRaw(VFullScreen),
    attrs: {
      background: 'interactive',
      closeDirection: 'RIGHT',
      showSwipeBanner: true,
      fullScreenStyle: {
        backgroundColor: '#fff',
      },
    },
    slots: {
      'default': {
        component: markRaw(DefaultSlot),
        attrs: {
          text: '123',

          onCreate() {
            // console.log('onCreated')
          },
        },
      },
      'swipe-banner': '<div style="position: absolute; height: 100%; top: 0; left: 0; width: 20px; background-color: pink;" />',
    },
  })

  return await modal.open()
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
    <button @click="() => useFullScreen()">
      create full screen component
    </button>
    <VFullScreen
      v-model="show"
      :modal-id="theModalId"
      full-screen-style="background-color: #fff;"
      close-direction="RIGHT"
      :show-swipe-banner="true"
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
      <div style="height: 500px">
        Direct use vfm
      </div>
      <div style="height: 500px">
        Direct use vfm
      </div>
      <div style="height: 500px">
        Direct use vfm
      </div>
    </VFullScreen>
  </div>

  <div v-for="i in 1000" :key="i">
    test: {{ i }}
  </div>

  <ModalsContainer />
</template>
