<template>
  <div>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
      @before-open="e => e.stop()"
    >
      <button class="modal__close" @click="showModal = false">
        <mdi-close></mdi-close>
      </button>
      <span class="modal__title">Hello, vue-final-modal</span>
      <div class="modal__content">
        <p v-for="i in 5" :key="i">
          Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
        </p>
      </div>
      <div class="modal__action">
        <button class="vfm-btn" @click="showModal = false">confirm</button>
        <button class="vfm-btn" @click="showModal = false">cancel</button>
      </div>
    </vue-final-modal>
    <button class="vfm-btn" @click="showModal = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false
  }),
  methods: {
    confirm() {
      this.showModal = false
    }
  }
}
</script>

<style scoped>
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 90%;
  margin: 0 1rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  background: #fff;
}
.modal__title {
  margin: 0 2rem 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__content {
  flex-grow: 1;
  overflow-y: auto;
}
.modal__action {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  padding: 1rem 0 0;
}
.modal__close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
