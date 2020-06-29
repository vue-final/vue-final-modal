<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      class="flex justify-center items-center"
      content-class="w-2/3 max-h-3/4 p-4 border rounded bg-white overflow-auto"
    >
      <h2 class="text-2xl mb-2"># Stackable Modal</h2>
      <base-button @click="showModal2 = true">Open second modal</base-button>
      <base-lorem />
    </vue-final-modal>
    <base-button @click="showModal = true">Stackable</base-button>
    <vue-final-modal
      v-model="showModal2"
      class="flex justify-center items-center"
      content-class="w-1/3 max-h-1/2 p-4 border rounded bg-white overflow-auto"
    >
      <h2 class="text-2xl mb-2"># Second Modal</h2>
      <base-button @click="showModal2 = false">Close second modal</base-button>
      <base-lorem />
    </vue-final-modal>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false,
    showModal2: false
  }),
  watch: {
    showModal(val) {
      val && this.$ga.event('open modal', 'stackable')
    }
  }
}
</script>
