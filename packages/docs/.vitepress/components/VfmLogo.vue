<template>
  <ClientOnly>
    <img v-if="!isDark" src="/preview.png" class="light-img" alt="Vue Final Modal Logo" />
    <img v-else src="/preview-dark.png" class="dark-img" alt="Vue Final Modal Logo" />
  </ClientOnly>
</template>

<script lang="ts" setup>
import { isDark } from '../theme/dark'
</script>
