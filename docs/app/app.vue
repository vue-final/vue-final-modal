<script setup lang="ts">
import DocusApp from 'docus/app/app.vue'
import { ModalsProvider } from 'vue-final-modal'
import 'vue-final-modal/style.css'
</script>

<template>
  <ModalsProvider>
    <DocusApp />
  </ModalsProvider>
</template>
