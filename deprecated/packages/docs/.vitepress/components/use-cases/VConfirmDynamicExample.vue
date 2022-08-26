<template>
  <button class="btn btn--highlight" @click="show">Open dynamic confirm dialog</button>
</template>

<script setup>
import { markRaw } from 'vue'
import { useModal } from 'vue-final-modal'
import VConfirm from './VConfirm.vue'
import VContent from '@/components/common/VContent.vue'

const { show, hide } = useModal({
  component: markRaw(VConfirm),
  bind: {
    title: 'Confirm'
  },
  on: {
    confirm() {
      hide()
    },
    cancel() {
      hide()
    }
  },
  slots: {
    // default: '<span>Are you sure?</span>',
    default: {
      component: markRaw(VContent),
      bind: {
        content: 'Are you sure?'
      }
    }
  }
})
</script>
