<script setup lang="ts">
import { ModalsContainer, defineTemplate, useModal } from 'vue-final-modal'
import DefaultSlot from './DefaultSlot.vue'

const modal = useModal({
  attrs: {
    hideOverlay: true,
    contentTransition: 'vfm-slide-right',
    contentStyle: {
      backgroundColor: '#fff',
      width: '100%',
      height: '100%',
    },
  },
  slots: {
    default: defineTemplate({
      component: DefaultSlot,
      attrs: {
        text: 'a full screen modal',
      },
    }),
  },
})
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="() => modal.open()">
      create full screen component
    </button>
  </div>

  <div v-for="i in 1000" :key="i">
    {{ i }}
  </div>

  <ModalsContainer />
</template>
