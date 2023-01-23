<script setup lang="ts">
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { isString } from '@vueuse/core'
import type { Ref } from 'vue'
import type { UseModalOptions, UseModalOptionsPrivate } from '../Modal'
import { useInternalVfm, useVfm } from '~/useApi'

const vfm = useVfm()
const _vfm = useInternalVfm()

const uid = Symbol('ModalsContainer')
const shouldMount = computed(() => uid === vfm.modalsContainers.value?.[0])

const openedDynamicModals: Ref<(UseModalOptions & UseModalOptionsPrivate)[]> = shallowRef([])

function syncOpenDynamicModals() {
  openedDynamicModals.value = vfm.dynamicModals.filter(modal => modal.modelValue)
}

function withSyncOpenDynamicModals(callbackFn?: () => void) {
  callbackFn?.()
  syncOpenDynamicModals()
}

watch(() => vfm.dynamicModals?.map(modal => modal.modelValue), (value, oldValue) => {
  if (!oldValue || value.length !== oldValue.length) {
    syncOpenDynamicModals()
    return
  }

  let index = value.length
  let shouldUpdate = false

  while (!shouldUpdate && index--) {
    if (value[index] === true && oldValue[index] === false)
      shouldUpdate = true
  }

  if (!shouldUpdate)
    return

  syncOpenDynamicModals()
}, {
  immediate: true,
})

vfm.modalsContainers.value.push(uid)
onBeforeUnmount(() => {
  vfm.modalsContainers.value = vfm.modalsContainers.value.filter(i => i !== uid)
})
</script>

<template>
  <template v-if="shouldMount">
    <component
      :is="modal.component"
      v-for="(modal, index) in openedDynamicModals"
      :key="modal.id"
      v-bind="modal.attrs"
      v-model="modal.modelValue"
      @closed="withSyncOpenDynamicModals(() => _vfm.resolvedClosed?.(index))"
      @opened="() => _vfm.resolvedOpened?.(index)"
    >
      <template v-for="(slot, key) in modal.slots" #[key] :key="key">
        <div v-if="isString(slot)" v-html="slot" />
        <component
          :is="slot.component"
          v-else-if="'component' in slot"
          v-bind="slot.attrs"
        />
        <component
          :is="slot"
          v-else
        />
      </template>
    </component>
  </template>
</template>
