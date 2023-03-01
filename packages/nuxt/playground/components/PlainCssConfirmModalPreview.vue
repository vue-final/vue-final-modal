<script setup lang="ts">
import { ModalsContainer, useVfm } from 'vue-final-modal'
import { showConfirmModal } from './showConfirmModal'

const vfm = useVfm()
</script>

<template>
  <button @click="() => showConfirmModal(vfm)">
    Open Modal
  </button>

  <ModalsContainer />
</template>
