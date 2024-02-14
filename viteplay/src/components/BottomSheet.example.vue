<script setup lang="ts">
import { ModalsContainer, defineTemplate, useModal } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'

const bottomSheet = useModal({
  attrs: {
    contentStyle: {
      'backgroundColor': '#fff',
      'position': 'absolute',
      'bottom': '0',
      'display': 'flex',
      'flex-direction': 'column',
      'width': '100%',
      'max-height': '90%',
      'overflow-y': 'auto',
    },
    swipeToClose: 'down',
    overlayTransition: { name: 'vfm-slide-down' },
    contentTransition: { name: 'vfm-slide-down' },
  },
  slots: {
    default: defineTemplate({
      component: DefaultSlot,
      attrs: {
        text: 'a bottom sheet modal',
      },
    }),
  },
})
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="() => bottomSheet.open()">
      create bottom sheet component
    </button>
  </div>

  <div v-for="i in 1000" :key="i">
    {{ i }}
  </div>

  <ModalsContainer />
</template>
