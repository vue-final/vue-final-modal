<script setup lang="ts">
import { nextTick } from 'vue'
import { dynamicModals } from '../api'
import type { UseModalOptions } from '../Modal'

function slice(index: number) {
  dynamicModals.splice(index, 1)
}

function closed(index: number, modal: UseModalOptions) {
  slice(index)
  modal.closed?.()
}

function beforeClose(modal: UseModalOptions) {
  if (modal.value)
    modal.rejectClose?.('hide')
}

async function beforeOpen(modal: UseModalOptions, index: number) {
  await nextTick()
  await nextTick()
  if (!modal.value) {
    slice(index)
    modal.reject?.('show')
  }
}

function isString(val: any) {
  return typeof val === 'string'
}
</script>

<template>
  <!-- eslint-disable vue/v-on-event-hyphenation -->
  <div>
    <component
      :is="modal.component"
      v-for="(modal, index) in dynamicModals"
      :key="modal.id"
      v-bind="modal.bind"
      v-model="modal.value"
      v-on="modal.on"
      @_beforeClose="beforeClose(modal)"
      @_closed="closed(index, modal)"
      @_beforeOpen="() => beforeOpen(modal, index)"
      @_opened="modal.opened"
    >
      <template v-for="(slot, key) in modal.slots" #[key] :key="key">
        <!-- eslint-disable vue/no-v-html -->
        <div v-if="isString(slot)" v-html="slot" />
        <component :is="slot.component" v-else v-bind="slot.bind" v-on="slot.on || {}" />
      </template>
    </component>
  </div>
</template>
