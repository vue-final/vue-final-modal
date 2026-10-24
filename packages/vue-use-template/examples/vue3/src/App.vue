<script setup lang="ts">
import { TemplateProvider } from 'vue-use-template'
import DialogConfirmPreview from './components/DialogConfirmPreview.vue'
</script>

<template>
  <TemplateProvider>
    <div class="h-screen flex items-center justify-center">
      <DialogConfirmPreview />
    </div>
  </TemplateProvider>
</template>
