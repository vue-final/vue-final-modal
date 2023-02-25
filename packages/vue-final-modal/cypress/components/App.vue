<script setup lang="ts">
import { ModalsContainer } from '~/index'
</script>

<template>
  <div>
    <div v-for="i in 1000" :key="i">
      id: {{ i }}
    </div>
    <slot />

    <ModalsContainer />
  </div>
</template>
