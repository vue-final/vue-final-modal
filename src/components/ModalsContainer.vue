<script setup lang="ts">
import { nextTick } from 'vue'
import { dynamicModals } from '../api'

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
    v-bind="modal.bind"
    v-model="modal.modelValue"
    v-on="modal.on"
    @_beforeClose="() => beforeClose(index)"
    @_closed="() => closed(index)"
    @_beforeOpen="() => beforeOpen(index)"
    @_opened="() => opened(index)"
  >
    <template v-if="modal?.slots?.default">
      <!-- eslint-disable vue/no-v-html -->
      <div v-if="isString(modal.slots.default)" v-html="modal.slots.default" />
      <component
        :is="modal.slots.default.component"
        v-else
        v-bind="modal.slots.default.bind"
        v-on="!isString(modal?.slots?.default) ? (modal?.slots?.default?.on || {}) : {}"
      />
    </template>
  </component>
</template>
