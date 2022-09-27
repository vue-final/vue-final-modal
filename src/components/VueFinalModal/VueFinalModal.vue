<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRefs, useAttrs, watch } from 'vue'
import { vueFinalModalProps } from './VueFinalModalProps'
import { deleteModalFromModals, deleteModalFromOpenedModals, modals, moveModalToLastOpenedModals, openedModals } from '~/api'
import { useTransition } from '~/useTransition'
import { useModelValue, useToClose } from '~/useModal'
import type { Modal } from '~/Modal'
import { useFocusTrap } from '~/useFocusTrap'
import { useLockScroll } from '~/useBodyScrollLock'
import { noop, once } from '~/utils'
import { useEvent } from '~/useEvent'

const props = defineProps(vueFinalModalProps)

const emit = defineEmits<{
  /** Public events */
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void
  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'clickOutside'): void

  /** Please use `beforeClose` instead of this private`_beforeClose` event */
  (e: '_beforeClose'): void
  /** Please use `closed` instead of this private`_closed` event */
  (e: '_closed'): void
  /** Please use `beforeOpen` instead of this private`_beforeOpen` event */
  (e: '_beforeOpen'): void
  /** Please use `opened` instead of this private`_opened` event */
  (e: '_opened'): void
}>()

const attrs = useAttrs()
const vfmRoot = ref<HTMLDivElement>()

const openedModalsLengthLocal = ref<number>(0)
const calculateZIndex = computed(() => {
  if (props.zIndex !== undefined)
    return props.zIndex
  else
    return +props.zIndexBase + 2 * (openedModalsLengthLocal.value)
})

const { focus, focusLast, blur } = useFocusTrap(props, { focusEl: vfmRoot })
const { enableBodyScroll, disableBodyScroll } = useLockScroll(props, { lockScrollEl: vfmRoot })
const { modelValueLocal } = useModelValue(props, emit)

const { stopEvent, emitEvent } = useEvent(emit, { modelValueLocal })

let resolveToggle: (res: string) => void = (noop)
let rejectToggle: (err: string) => void = (noop)

const {
  visible,

  contentVisible,
  contentListeners,
  contentTransition,

  overlayVisible,
  overlayListeners,
  overlayTransition,

  enterTransition,
  leaveTransition,
} = useTransition(props, {
  async onEntering() {
    await nextTick()
    disableBodyScroll()
  },
  onEnter() {
    emitEvent('opened')
    resolveToggle('opened')
    focus()
  },
  onLeaving() {
    blur()
  },
  onLeave() {
    emitEvent('closed')
    resolveToggle('closed')
  },
})

const { hideOverlay } = toRefs(props)
const modalInstance = computed<Modal>(() => ({
  modalId: props.modalId,
  hideOverlay,
  overlayVisible,
  focus,
  toggle(show?: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      resolveToggle = once((res: string) => resolve(res))
      rejectToggle = once((err: string) => reject(err))

      const value = typeof show === 'boolean' ? show : !modelValueLocal.value
      modelValueLocal.value = value
      emit('update:modelValue', value)
    })
  },
}))

modals.push(modalInstance)

if (modelValueLocal.value)
  open()

watch(modelValueLocal, (value) => {
  if (stopEvent.value)
    stopEvent.value = false
  else
    value ? open() : close()
})

async function open() {
  if (emitEvent('beforeOpen')) {
    rejectToggle('beforeOpen')
    return
  }

  openedModalsLengthLocal.value = openedModals.length
  moveModalToLastOpenedModals(modalInstance)
  openLastOverlay()
  enterTransition()
}

function close() {
  if (emitEvent('beforeClose')) {
    rejectToggle('beforeClose')
    return
  }
  enableBodyScroll()
  deleteModalFromOpenedModals(modalInstance)
  focusLast()
  openLastOverlay()
  leaveTransition()
}

async function openLastOverlay() {
  await nextTick()
  // Close all overlay first
  openedModals.forEach(modal => modal.value.overlayVisible.value = false)
  // Open the last overlay if it has overlay
  if (openedModals.length > 0) {
    const modal = openedModals[openedModals.length - 1]
    !modal.value.hideOverlay?.value && (modal.value.overlayVisible.value = true)
  }
}

onBeforeUnmount(() => {
  enableBodyScroll()
  deleteModalFromModals(modalInstance)
  deleteModalFromOpenedModals(modalInstance)
  focusLast()
  openLastOverlay()
})

const { onEsc, onMouseupRoot, onMousedown } = useToClose(props, emit, { vfmRoot, visible, modelValueLocal })
</script>

<template>
  <teleport :to="teleportTo ? teleportTo : undefined" :disabled="!teleportTo">
    <div
      v-if="displayDirective !== 'if' || visible"
      v-show="displayDirective !== 'show' || visible"
      v-bind="attrs"
      ref="vfmRoot"
      class="vfm vfm--fixed vfm--inset"
      :class="{ 'vfm--prevent-none': background === 'interactive' }"
      :style="{ zIndex: calculateZIndex }"
      role="dialog"
      aria-modal="true"
      @keydown.esc="onEsc"
      @mouseup.self="() => onMouseupRoot()"
      @mousedown.self="e => onMousedown(e)"
    >
      <Transition v-if="!hideOverlay" v-bind="overlayTransition" v-on="overlayListeners">
        <div
          v-if="overlayVisible"
          class="vfm__overlay vfm--overlay vfm--absolute vfm--inset vfm--prevent-none"
          style="z-index: -1"
          :class="overlayClass"
          :style="overlayStyle"
          aria-hidden="true"
        />
      </Transition>
      <Transition v-bind="contentTransition" v-on="contentListeners">
        <div
          v-if="contentVisible"
          class="vfm__content vfm--outline-none"
          :class="[contentClass, { 'vfm--prevent-auto': background === 'interactive' }]"
          :style="contentStyle"
          tabindex="0"
          @mousedown="() => onMousedown()"
        >
          <slot />
        </div>
      </Transition>
    </div>
  </teleport>
</template>

<style>
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
.vfm--prevent-none {
  pointer-events: none;
}
.vfm--prevent-auto {
  pointer-events: auto;
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
