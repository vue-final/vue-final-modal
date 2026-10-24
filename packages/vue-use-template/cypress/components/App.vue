<script setup lang="ts">
import { defineAsyncComponent, h, reactive, ref } from 'vue'
import { defineTemplate, TemplateProvider, useTemplate } from 'vue-use-template'

const confirmed = ref(false)
const props = reactive({
  title: 'Hello World!',
})

const { show, hide } = useTemplate({
  component: defineAsyncComponent(() => import('./DialogConfirm.vue')),
  props,
  emits: {
    onConfirm: () => {
      confirmed.value = true
      hide()
    },
    onCancel: () => hide(),
  },
  slots: {
    default: defineTemplate({
      component: () => h('p', 'This is a dialog content.'),
    }),
  },
})
</script>

<template>
  <TemplateProvider>
    <button @click="show()">
      Open dialog
    </button>
    <p v-if="confirmed">
      Confirmed!
    </p>
  </TemplateProvider>
</template>
