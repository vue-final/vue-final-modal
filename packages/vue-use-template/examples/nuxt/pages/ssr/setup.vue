<script setup lang="ts">
import { useTemplate } from 'vue-use-template'
import SsrNotice from '../../components/SsrNotice.vue'

useTemplate({ component: SsrNotice, props: { text: 'Shown in page setup' } }).show()
</script>

<template>
  <p>show() in page setup</p>
</template>
