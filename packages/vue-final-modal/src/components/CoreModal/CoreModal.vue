<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, toRef, watch } from 'vue'
import { coreModalProps } from './CoreModalProps'
import { useTransition } from '~/useTransition'
import { useModelValue, useToClose } from '~/useModal'
import type { Modal } from '~/Modal'
import { useFocusTrap } from '~/useFocusTrap'
import { useLockScroll } from '~/useBodyScrollLock'
import { noop, once } from '~/utils'
import { useEvent } from '~/useEvent'
import { useZIndex } from '~/useZIndex'
import { useVfm } from '~/useApi'

const props = defineProps(coreModalProps)

const emit = defineEmits<{
  (e: 'beforeOpen'): void
  (e: 'opened'): void
  (e: 'beforeClose'): void
  (e: 'closed'): void
  (e: 'update:modelValue', modelValue: boolean): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}>()

const vfm = useVfm()

const vfmRootEl = ref<HTMLDivElement>()
const { zIndex, refreshZIndex } = useZIndex(props)
const { focus, focusLast, blur } = useFocusTrap(props, { focusEl: vfmRootEl })
const { enableBodyScroll, disableBodyScroll } = useLockScroll(props, { lockScrollEl: vfmRootEl })
const { modelValueLocal } = useModelValue(props, emit)
const { emitEvent } = useEvent(emit)

let resolveToggle: (res: string) => void = (noop)

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
    focus()
    await nextTick()
    disableBodyScroll()
  },
  onEnter() {
    emitEvent('opened')
    resolveToggle('opened')
  },
  onLeaving() {
    blur()
  },
  onLeave() {
    emitEvent('closed')
    resolveToggle('closed')
  },
})

const { onEsc, onMouseupRoot, onMousedown } = useToClose(props, emit, { vfmRootEl, visible, modelValueLocal })

const hideOverlay = toRef(props, 'hideOverlay')
const modalInstance = computed<Modal>(() => ({
  modalId: props.modalId,
  hideOverlay,
  overlayVisible,
  focus,
  toggle(show?: boolean): Promise<string> {
    return new Promise((resolve) => {
      resolveToggle = once((res: string) => resolve(res))

      const value = typeof show === 'boolean' ? show : !modelValueLocal.value
      modelValueLocal.value = value
      emit('update:modelValue', value)
    })
  },
}))

vfm.modals.push(modalInstance)

if (modelValueLocal.value)
  open()

watch(modelValueLocal, (value) => {
  value ? open() : close()
})

async function open() {
  emitEvent('beforeOpen')
  refreshZIndex()
  vfm.moveToLastOpenedModals(modalInstance)
  vfm.openLastOverlay()
  enterTransition()
}

function close() {
  emitEvent('beforeClose')
  enableBodyScroll()
  vfm.deleteFromOpenedModals(modalInstance)
  focusLast()
  vfm.openLastOverlay()
  leaveTransition()
}

onBeforeUnmount(() => {
  enableBodyScroll()
  vfm.deleteFromModals(modalInstance)
  vfm.deleteFromOpenedModals(modalInstance)
  focusLast()
  vfm.openLastOverlay()
})
</script>

<template>
  <div
    v-if="displayDirective !== 'if' || visible"
    v-show="displayDirective !== 'show' || visible"
    ref="vfmRootEl"
    class="vfm vfm--fixed vfm--inset"
    :class="{ 'vfm--prevent-none': background === 'interactive' }"
    :style="{ zIndex }"
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
        v-show="contentVisible"
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
