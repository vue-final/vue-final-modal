<script setup lang="ts">
import { showConfirmModal } from './showConfirmModal'
</script>

<template>
  <button @click="() => showConfirmModal()">
    Open Modal
  </button>
</template>
