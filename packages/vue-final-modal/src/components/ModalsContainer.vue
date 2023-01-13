<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { isString } from '@vueuse/core'
import type { Ref } from 'vue'
import type { UseModalOptionsPrivate } from '../Modal'
import { useInternalVfm, useVfm } from '~/useApi'

const { modalsContainers, dynamicModals } = useVfm()
const { resolvedClosed, resolvedOpened } = useInternalVfm()

const uid = Symbol('ModalsContainer')
const shouldMount = computed(() => uid === modalsContainers.value[0])

const openedDynamicModals: Ref<UseModalOptionsPrivate[]> = ref([])

function syncOpenDynamicModals() {
  openedDynamicModals.value = dynamicModals.filter(modal => modal.modelValue)
}

function withSyncOpenDynamicModals(callbackFn?: () => void) {
  callbackFn?.()
  syncOpenDynamicModals()
}

watch(() => dynamicModals.map(modal => modal.modelValue), (value, oldValue) => {
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

modalsContainers.value.push(uid)
onBeforeUnmount(() => {
  modalsContainers.value = modalsContainers.value.filter(i => i !== uid)
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
      @closed="withSyncOpenDynamicModals(() => resolvedClosed(index))"
      @opened="() => resolvedOpened(index)"
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
