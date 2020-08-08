<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="w-2/3 max-h-3/4 p-4 border rounded bg-white overflow-auto"
      attach="#attach"
      :lock-scroll="false"
    >
      <base-lorem />
    </vue-final-modal>
    <base-button @click="showModal = true">Attach</base-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  }),
  watch: {
    showModal(val) {
      val && this.$ga.event('open modal', 'base-example-attach')
    }
  }
}
</script>
