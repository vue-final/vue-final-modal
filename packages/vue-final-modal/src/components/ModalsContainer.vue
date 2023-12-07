<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { isString } from '~/utils'
import { useVfm } from '~/useApi'

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
