<template>
  <div>
    <vue-final-modal v-model="showModal" content-class="modal-content">
      <span class="modal__title">Hello, vue-final-modal</span>
    </vue-final-modal>
    <v-button highlight @click="showModal = true">Open modal</v-button>
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
::v-deep(.modal-content) {
  display: inline-block;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>

<style scoped>
.dark-mode div ::v-deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
