<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
      overlay-class="overlay"
      transition="vfm"
      overlay-transition="vfm"
      :lock-scroll="true"
      :hide-overlay="false"
      :click-to-close="true"
      :prevent-click="false"
      :attach="false"
      :z-index="1000"
    >
      <span class="text-2xl mb-2">Hello, world!</span>
    </vue-final-modal>
    <base-button @click="showModal = true">Hello, world!</base-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style lang="scss" scoped>
::v-deep .overlay {
  opacity: 0.5;
}
</style>
