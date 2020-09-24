<template>
  <button class="base-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.base-button {
  @apply mb-2 px-2 py-1 border rounded;
}
</style>
