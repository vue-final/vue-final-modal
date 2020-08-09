<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="w-2/3 max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
      :click-to-close="false"
    >
      <h2 class="text-2xl mb-2">
        # Click overlay will not close modal
      </h2>
      <base-button class="mb-2" @click="showModal = false"
        >Close modal</base-button
      >
      <base-lorem />
    </vue-final-modal>
    <base-button @click="showModal = true">Click to close</base-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>
