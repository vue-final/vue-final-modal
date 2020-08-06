<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="w-2/3 max-h-3/4 p-4 border rounded bg-white overflow-auto"
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
  }),
  watch: {
    showModal(val) {
      val && this.$ga.event('open modal', 'click-to-close')
    }
  }
}
</script>
