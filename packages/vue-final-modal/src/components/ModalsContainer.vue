<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { isString } from '~/utils'
import { useInternalVfm, useVfm } from '~/useApi'

const vfm = useVfm()
const _vfm = useInternalVfm()

const uid = Symbol('ModalsContainer')
const shouldMount = computed(() => uid === vfm.modalsContainers.value?.[0])

vfm.modalsContainers.value.push(uid)
onBeforeUnmount(() => {
  vfm.modalsContainers.value = vfm.modalsContainers.value.filter(i => i !== uid)
})
</script>

<template>
  <template v-if="shouldMount">
    <component
      :is="modal.component as any"
      v-for="(modal, index) in vfm.dynamicModals"
      :key="modal.id"
      v-bind="{
        displayDirective: modal?.keepAlive ? 'show' : undefined,
        ...modal.attrs,
      }"
      v-model="modal.modelValue"
      @closed="() => _vfm.resolvedClosed?.(index)"
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
