<script setup lang="ts">
import type { BaseTransitionProps, ComputedRef } from 'vue'
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import type { Modal } from '../Modal'
import { modals, openedModals } from '../api'
import { useEvent } from '../useEvent'
import { TransitionState, useTransition } from '../useTransition'
import { noop, once } from '../utils'

const props = withDefaults(defineProps<{
  name?: string
  teleportTo?: string
  disabledTeleport?: boolean
  modelValue?: boolean
  displayDirective?: 'if' | 'show'
  hideOverlay?: boolean
  transition?: 'vfm' | BaseTransitionProps
  overlayTransition?: 'vfm' | BaseTransitionProps
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

const modelValueLocal = ref<boolean>(props.modelValue)
watch(() => props.modelValue, (val) => {
  modelValueLocal.value = val
})

const modalInstance = computed<Modal>(() => ({
  props,
  toggle,
}))

modals.push(modalInstance)

const {
  visible,

  containerVisible,
  containerState,
  containerListeners,
  containerTransition,

  overlayVisible,
  overlayListeners,
  overlayTransition,

  enterTransition,
  leaveTransition,
} = useTransition(props)

const { stopEvent, emitBeforeEvent } = useEvent(emit)

if (modelValueLocal.value)
  open()

watch(modelValueLocal, (modelValueLocal) => {
  if (stopEvent.value) {
    stopEvent.value = false
    return
  }

  modelValueLocal ? open() : close()
})

let resolveToggle: (res: string) => void = noop
let rejectToggle: (err: string) => void = noop

function toggle(show?: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    resolveToggle = once((res: string) => resolve(res))
    rejectToggle = once((err: string) => reject(err))

    const value = typeof show === 'boolean' ? show : !modelValueLocal.value

    modelValueLocal.value = value
    emit('update:modelValue', value)
  })
}

/**
 * Side effect about modal transition state update
 */
watch(containerState, (state) => {
  switch (state) {
    case TransitionState.Enter:
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('_opened')
      emit('opened')
      resolveToggle('opened')
      break
    case TransitionState.Leave:
      // eslint-disable-next-line vue/custom-event-name-casing
      emit('_closed')
      emit('closed')
      resolveToggle('closed')
      break
  }
})

async function open() {
  if (!modelValueLocal.value)
    return
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('_beforeOpen')
  const { stopEvent } = emitBeforeEvent('beforeOpen', false)
  if (stopEvent) {
    rejectToggle('beforeOpen')
    return
  }

  deleteModalFromOpenedModals(modalInstance)
  openedModals.push(modalInstance)

  enterTransition()
}

function close() {
  if (modelValueLocal.value)
    return
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('_beforeClose')
  const { stopEvent } = emitBeforeEvent('beforeClose', true)
  if (stopEvent) {
    rejectToggle('beforeClose')
    return
  }

  deleteModalFromOpenedModals(modalInstance)

  leaveTransition()
}

onBeforeUnmount(() => {
  deleteModalFromModals(modalInstance)
  deleteModalFromOpenedModals(modalInstance)
})

function deleteModalFromOpenedModals(modal: ComputedRef<Modal>) {
  const index = openedModals.findIndex(_modal => _modal.value === modal.value)
  if (index !== -1)
    openedModals.splice(index, 1)
}
function deleteModalFromModals(modal: ComputedRef<Modal>) {
  const index = modals.findIndex(_modal => _modal.value === modal.value)
  if (index !== -1)
    modals.splice(index, 1)
}
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
