<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="w-2/3 max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded overflow-auto"
      prevent-click
    >
      <h2 class="text-2xl mb-2">
        # Click overlay will not close modal, please try to click button on
        background
      </h2>
      <button class="vfm-btn mb-2" @click="showModal = false">
        Close modal
      </button>
      <base-lorem />
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Prevent click</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>
