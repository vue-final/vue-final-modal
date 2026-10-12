<script setup lang="ts">
import { useTemplate } from 'vue-use-template'
import SsrNotice from './SsrNotice.vue'

useTemplate({ component: SsrNotice, props: { text: 'Shown in a lazy component' } }).show()
</script>

<template>
  <p>show() in a lazy component</p>
</template>
