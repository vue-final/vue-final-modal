<script setup lang="ts">
import type { BaseTransitionProps } from 'vue'
import { onBeforeUnmount, watch } from 'vue'
import { deleteModalFromModals, deleteModalFromOpenedModals, moveModalToLastOpenedModals } from '../api'
import { useEvent } from '../useEvent'
import { useTransition } from '../useTransition'
import { useModelValue, useToggle } from '../useModal'

const props = withDefaults(defineProps<{
  name?: string
  teleportTo?: string
  disabledTeleport?: boolean
  modelValue?: boolean
  displayDirective?: 'if' | 'show'
  hideOverlay?: boolean
  transition?: 'vfm' | string | BaseTransitionProps
  overlayTransition?: 'vfm' | string | BaseTransitionProps
}>(), {
  teleportTo: 'body',
  modelValue: false,
  displayDirective: 'show',
  transition: 'vfm',
  overlayTransition: 'vfm',
})

const emit = defineEmits<{
  /** Public events */
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void
  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'update:modelValue', modelValue: boolean): void

  /** Private events */
  (e: '_beforeClose'): void
  (e: '_closed'): void
  (e: '_beforeOpen'): void
  (e: '_opened'): void
}>()

const { modelValueLocal } = useModelValue(props)
const { resolveToggle, rejectToggle, modalInstance } = useToggle(props, emit, { modelValueLocal })
const { stopEvent, emitEvent } = useEvent(emit, {
  onStop(e) { rejectToggle(e) },
})

const {
  visible,

  containerVisible,
  containerListeners,
  containerTransition,

  overlayVisible,
  overlayListeners,
  overlayTransition,

  enterTransition,
  leaveTransition,
} = useTransition(props, {
  onEnter() {
    emitEvent('opened')
    resolveToggle('opened')
  },
  onLeave() {
    emitEvent('closed')
    resolveToggle('closed')
  },
})

if (modelValueLocal.value)
  open()

watch(modelValueLocal, (value) => {
  if (stopEvent.value)
    stopEvent.value = false
  else
    value ? open() : close()
})

async function open() {
  emitEvent('beforeOpen')
  moveModalToLastOpenedModals(modalInstance)
  enterTransition()
}

function close() {
  emitEvent('beforeClose')
  deleteModalFromOpenedModals(modalInstance)
  leaveTransition()
}

onBeforeUnmount(() => {
  deleteModalFromModals(modalInstance)
  deleteModalFromOpenedModals(modalInstance)
})
</script>

<template>
  <teleport :to="teleportTo" :disabled="!teleportTo || disabledTeleport">
    <div
      v-if="displayDirective !== 'if' || visible"
      v-show="displayDirective !== 'show' || visible"
      class="vfm vfm--fixed vfm--inset"
    >
      <Transition v-if="!hideOverlay" v-bind="overlayTransition" v-on="overlayListeners">
        <div v-if="overlayVisible" class="vfm__overlay vfm--overlay vfm--absolute vfm--inset" />
      </Transition>
      <Transition v-bind="containerTransition" v-on="containerListeners">
        <div v-if="containerVisible" class="vfm__container vfm--absolute vfm--inset vfm--outline-none">
          <div class="vfm__content">
            <slot />
            <button @click="emit('update:modelValue', false)">
              close
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </teleport>
</template>

<style scoped>
.vfm--fixed {
  position: fixed;
}
.vfm--absolute {
  position: absolute;
}
.vfm--inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
.vfm--overlay {
  background-color: rgba(0, 0, 0, 0.5);
}

.vfm--outline-none:focus {
  outline: none;
}

.vfm-enter-active,
.vfm-leave-active {
  transition: opacity .3s;
}
.vfm-enter-from,
.vfm-leave-to {
  opacity: 0;
}
</style>
