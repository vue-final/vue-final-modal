<script setup lang="ts">
import { ModalsContainer, useVfm } from 'vue-final-modal'
import { showModalConfirm } from './showModalConfirm'

const vfm = useVfm()
</script>

<template>
  <button @click="() => showModalConfirm(vfm)">
    Open Modal
  </button>

  <ModalsContainer />
</template>
