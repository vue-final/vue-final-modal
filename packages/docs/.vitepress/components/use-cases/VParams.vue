<template>
  <vue-final-modal
    v-model="show"
    name="stackable"
    classes="modal-container"
    content-class="modal-content"
    prevent-none
    @closed="e => e.stop()"
  >
    <template #default="{ params }">
      <button class="modal__close" @click="vfm.hide('stackable')">×</button>
      <span class="modal__title">{{ params.test }} Hello, vue-final-modal</span>
      <div class="modal__content">
        <p v-for="i in 5" :key="i">
          Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
        </p>
      </div>
      <div class="modal__action">
        <button class="btn" @click="vfm.hide('stackable')">confirm</button>
        <button class="btn" @click="vfm.hide('stackable')">cancel</button>
      </div>
    </template>
  </vue-final-modal>
  <button class="btn" @click="vfm.show('stackable', { test: 123 })">Show modal with params</button>
  <button class="btn" @click="vfm.toggle('stackable', null, { test: 321 })">Toggle modal with params</button>
  <button class="btn" @click="vfm.show('stackable')">Show modal</button>
  <button class="btn" @click="vfm.hide('stackable')">Hide modal</button>
</template>

<script setup>
import { ref } from 'vue'
import { VueFinalModal, $vfm as vfm } from 'vue-final-modal'

const show = ref(false)

function confirm() {
  show.value = false
}
</script>

<style scoped>
:deep(.modal-container) {
  display: flex;
  justify-content: center;
  align-items: center;
}
:deep(.modal-content) {
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
.dark div :deep(.modal-content) {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
