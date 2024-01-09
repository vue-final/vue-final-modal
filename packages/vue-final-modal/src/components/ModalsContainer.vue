<script setup lang="ts">
import type { Component } from 'vue-demi'
import { computed, onBeforeUnmount } from 'vue-demi'
import type { ModalSlotOptions } from '..'
import { isString } from '~/utils'
import { isModalSlotOptions, useVfm } from '~/useApi'

const { modalsContainers, dynamicModals } = useVfm()

const uid = Symbol(__DEV__ ? 'ModalsContainer' : '')
const shouldMount = computed(() => uid === modalsContainers.value?.[0])

modalsContainers.value.push(uid)
onBeforeUnmount(() => {
  modalsContainers.value = modalsContainers.value.filter(i => i !== uid)
})

function resolvedClosed(index: number) {
  dynamicModals[index]?.resolveClosed?.()
  if (!dynamicModals[index]?.keepAlive)
    dynamicModals.splice(index, 1)
}

function resolvedOpened(index: number) {
  dynamicModals[index]?.resolveOpened?.()
}
</script>

<template>
  <template v-if="shouldMount">
    <component
      :is="modal.component"
      v-for="(modal, index) in dynamicModals"
      :key="modal.id"
      v-bind="{
        displayDirective: modal?.keepAlive ? 'show' : undefined,
        ...(typeof modal.attrs === 'object' ? modal.attrs : {}),
      }"
      v-model="modal.modelValue"
      @closed="() => resolvedClosed(index)"
      @opened="() => resolvedOpened(index)"
    >
      <template v-for="(slot, key) in modal.slots" #[key] :key="key">
        <div v-if="isString(slot)" v-html="slot" />
        <component
          :is="(slot as ModalSlotOptions).component"
          v-else-if="isModalSlotOptions(slot)"
          v-bind="(slot as ModalSlotOptions).attrs"
        />
        <component
          :is="slot as Component"
          v-else
        />
      </template>
    </component>
  </template>
</template>
