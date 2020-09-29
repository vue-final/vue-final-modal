<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
    >
      <div
        class="p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded"
      >
        <span class="text-2xl">Hello, world!</span>
      </div>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>
