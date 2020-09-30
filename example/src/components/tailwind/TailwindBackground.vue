<template>
  <div>
    <vue-final-modal v-model="showModal">
      <div
        class="inline-block p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded"
      >
        <span class="text-2xl">Hello, vue-final-modal</span>
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
