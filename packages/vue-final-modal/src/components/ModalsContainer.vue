<script setup lang="ts">
import { nextTick } from 'vue'
import { dynamicModals } from '~/api'

async function beforeClose(index: number) {
  const modal = dynamicModals[index]
  if (modal.modelValue)
    modal.rejectClose?.('[Vue Final Modal] reject beforeClose')
}

function closed(index: number) {
  dynamicModals[index].resolveClosed?.()
}

async function beforeOpen(index: number) {
  await nextTick()
  const modal = dynamicModals[index]
  if (!modal.modelValue) {
    dynamicModals.splice(index, 1)
    modal.rejectOpen?.('[Vue Final Modal] reject beforeOpen')
  }
}

function opened(index: number) {
  dynamicModals[index].resolveOpened?.()
}

function isString(str: any): str is string {
  return typeof str === 'string'
}
</script>

<template>
  <!-- eslint-disable vue/v-on-event-hyphenation -->
  <component
    :is="modal.component"
    v-for="(modal, index) in dynamicModals"
    :key="modal.id"
    v-bind="modal.attrs"
    v-model="modal.modelValue"
    @_beforeClose="() => beforeClose(index)"
    @_closed="() => closed(index)"
    @_beforeOpen="() => beforeOpen(index)"
    @_opened="() => opened(index)"
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
