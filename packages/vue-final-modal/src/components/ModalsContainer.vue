<script setup lang="ts">
import { dynamicModals } from '~/api'

function closed(index: number) {
  dynamicModals[index].resolveClosed?.()
}

function opened(index: number) {
  dynamicModals[index].resolveOpened?.()
}

function isString(str: any): str is string {
  return typeof str === 'string'
}
</script>

<template>
  <component
    :is="modal.component"
    v-for="(modal, index) in dynamicModals"
    :key="modal.id"
    v-bind="modal.attrs"
    v-model="modal.modelValue"
    @closed="() => closed(index)"
    @opened="() => opened(index)"
  >
    <template v-for="(slot, key) in modal.slots" #[key] :key="key">
      <!-- eslint-disable vue/no-v-html -->
      <div v-if="isString(slot)" v-html="slot" />
      <component
        :is="slot.component"
        v-else
        v-bind="slot.attrs"
      />
    </template>
  </component>
</template>
