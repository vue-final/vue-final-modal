<template>
  <button class="base-button" v-on="$listeners">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
.base-button {
  @apply mb-2 px-2 py-1 border rounded;
}
</style>
