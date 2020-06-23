<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      class="flex justify-center items-center"
      content-class="w-2/3 max-h-3/4 p-4 border rounded bg-white overflow-auto"
      hide-overlay
    >
      <h2 class="text-2xl mb-2"># Hide overlay</h2>
      <base-lorem />
    </vue-final-modal>
    <base-button @click="showModal = true">Hide overlay</base-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  })
}
</script>
