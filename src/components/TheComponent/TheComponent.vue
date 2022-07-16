<script setup lang="ts">
import { useMouse } from '@vueuse/core'

const props = defineProps<{
  /**
   * @description Here is description of this prop
   */
  msg?: string
}>()

const { x, y } = useMouse()
</script>

<template>
  <div class="the-component">
    <h1>{{ props.msg }}</h1>
    <h2>This is a component use @vueuse/core</h2>
    <span>x: {{ x }}, y: {{ y }}</span>
  </div>
</template>

<style scoped>
.the-component {
  color: #666;
}
</style>
