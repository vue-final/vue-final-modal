<script setup>
const colorMode = useColorMode()
</script>

<template>
  <img :src="`/logo-${colorMode.value}.png`" alt="Vue Final Modal Logo" width="220" height="40">
</template>
