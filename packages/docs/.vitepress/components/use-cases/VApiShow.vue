<template>
  <custom-modal v-model="show" name="VApiShow" @confirm="show = false" @cancel="show = false">
    <template #default="{ params }">Hi {{ params.userName }}</template>
    <template #title>$vfm.show</template>
  </custom-modal>
  <button class="btn btn--highlight" @click="$vfm.show('VApiShow', { userName: 'vue-final-modal' })">Open modal</button>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
</script>
