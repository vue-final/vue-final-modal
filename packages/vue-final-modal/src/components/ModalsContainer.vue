<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue'
import { useVfm } from '~/useApi'
import { isString } from '~/utils'

const { modalsContainers, dynamicModals, resolvedClosed, resolvedOpened } = useVfm()

const uid = Symbol('ModalsContainer')
const shouldMount = computed(() => uid === modalsContainers.value[0])

modalsContainers.value.push(uid)
onBeforeUnmount(() => {
  modalsContainers.value = modalsContainers.value.filter(i => i !== uid)
})

watch(() => modalsContainers.value.length, (val) => {
  if (shouldMount.value && val > 1)
    console.warn('[Vue Final Modal] Warning: <ModalsContainer> should be mount only once in your Vue App.')
})
</script>

<template>
  <template v-if="shouldMount">
    <component
      :is="modal.component"
      v-for="(modal, index) in dynamicModals"
      :key="modal.id"
      v-bind="modal.attrs"
      v-model="modal.modelValue"
      @closed="() => resolvedClosed(index)"
      @opened="() => resolvedOpened(index)"
    >
      <template v-for="(slot, key) in modal.slots" #[key] :key="key">
        <div v-if="isString(slot)" v-html="slot" />
        <component
          :is="slot.component"
          v-else
          v-bind="slot.attrs"
        />
      </template>
    </component>
  </template>
</template>
