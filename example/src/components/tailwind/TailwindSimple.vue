<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
    >
      <span class="text-2xl mb-2">Hello, world!</span>
    </vue-final-modal>
    <button @click="showModal = true">Simple</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>

<style scoped>
button {
  @apply mb-2 px-2 py-1 border rounded;
}
</style>
