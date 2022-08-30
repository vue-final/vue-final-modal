<script setup lang="ts">
withDefaults(defineProps<{
  modelValue?: boolean
  teleportTo?: string
}>(), {
  modelValue: false,
  teleportTo: 'body',
})

defineEmits<{
  (e: '_beforeClose'): void
  (e: '_closed'): void
  (e: '_beforeOpen'): void
  (e: '_opened'): void
}>()

function open() {

}

function close() {

}
</script>

<template>
  <teleport :to="teleportTo" :disabled="!teleportTo">
    <div>VueFinalModal</div>
  </teleport>
</template>
