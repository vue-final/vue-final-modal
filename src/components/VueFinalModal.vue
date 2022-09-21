<script setup lang="ts">
import type { BaseTransitionProps } from 'vue'
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { deleteModalFromModals, deleteModalFromOpenedModals, moveModalToLastOpenedModals } from '../api'
import { useEvent } from '../useEvent'
import { useTransition } from '../useTransition'
import { useModelValue, useToClose, useToggle } from '../useModal'
import type { StyleValue } from '../Modal'
import { useFocusTrap } from '../useFocusTrap'
import { useLockScroll } from '../bodyScrollLock'

const props = withDefaults(defineProps<{
  name?: string
  teleportTo?: string
  disabledTeleport?: boolean
  modelValue?: boolean
  displayDirective?: 'if' | 'show'
  hideOverlay?: boolean
  transition?: 'vfm' | string | BaseTransitionProps
  overlayTransition?: 'vfm' | string | BaseTransitionProps
  overlayClass?: any
  classes?: any
  contentClass?: any
  overlayStyle?: StyleValue
  styles?: StyleValue
  contentStyle?: StyleValue
  clickToClose?: boolean
  escToClose?: boolean
  nonModal?: boolean
  autoFocus?: boolean
  focusTrap?: boolean
  lockScroll?: boolean
}>(), {
  teleportTo: 'body',
  modelValue: false,
  displayDirective: 'show',
  transition: 'vfm',
  overlayTransition: 'vfm',
  clickToClose: true,
  escToClose: true,
  autoFocus: true,
  lockScroll: true,
})

const emit = defineEmits<{
  /** Public events */
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void
  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'update:modelValue', modelValue: boolean): void
  (e: 'clickOutside'): void

  /** Private events */
  (e: '_beforeClose'): void
  (e: '_closed'): void
  (e: '_beforeOpen'): void
  (e: '_opened'): void
}>()

const vfmContainer = ref<HTMLDivElement>()

const { focus, focusLast, blur } = useFocusTrap(props, { focusEl: vfmContainer })
const { enableBodyScroll, disableBodyScroll } = useLockScroll(props, { lockScrollEl: vfmContainer })
const { modelValueLocal } = useModelValue(props, emit)
const { resolveToggle, rejectToggle, modalInstance } = useToggle(props, { focus, modelValueLocal })
const { stopEvent, emitEvent } = useEvent(emit, {
  modelValueLocal,
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
  async onEntering() {
    await nextTick()
    disableBodyScroll()
  },
  onEnter() {
    emitEvent('opened')
    resolveToggle.value('opened')
    focus()
  },
  onLeaving() {
    blur()
  },
  onLeave() {
    emitEvent('closed')
    resolveToggle.value('closed')
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
  if (emitEvent('beforeOpen')) {
    rejectToggle.value('beforeOpen')
    return
  }
  moveModalToLastOpenedModals(modalInstance)
  enterTransition()
}

function close() {
  if (emitEvent('beforeClose')) {
    rejectToggle.value('beforeClose')
    return
  }
  enableBodyScroll()
  deleteModalFromOpenedModals(modalInstance)
  focusLast()

  leaveTransition()
}

onBeforeUnmount(() => {
  deleteModalFromModals(modalInstance)
  deleteModalFromOpenedModals(modalInstance)
})

const { onEsc, onMouseupContainer, onMousedown } = useToClose(props, emit, { vfmContainer, visible, modelValueLocal })
</script>

<template>
  <teleport :to="teleportTo" :disabled="!teleportTo || disabledTeleport">
    <div
      v-if="displayDirective !== 'if' || visible"
      v-show="displayDirective !== 'show' || visible"
      class="vfm vfm--fixed vfm--inset"
      :class="{ 'vfm--prevent-none': nonModal }"
      @keydown.esc="onEsc"
    >
      <Transition v-if="!hideOverlay" v-bind="overlayTransition" v-on="overlayListeners">
        <div
          v-if="overlayVisible"
          class="vfm__overlay vfm--overlay vfm--absolute vfm--inset"
          :class="overlayClass"
          :style="overlayStyle"
        />
      </Transition>
      <Transition v-bind="containerTransition" v-on="containerListeners">
        <div
          v-if="containerVisible"
          ref="vfmContainer"
          class="vfm__container vfm--absolute vfm--inset vfm--outline-none"
          :class="classes"
          :style="styles"
          role="dialog"
          aria-modal="true"
          tabindex="-1"
          @mouseup.self="() => onMouseupContainer()"
          @mousedown.self="e => onMousedown(e)"
        >
          <div
            class="vfm__content"
            :class="[contentClass, { 'vfm--prevent-auto': nonModal }]"
            :style="contentStyle"
            @mousedown="() => onMousedown()"
          >
            <slot />
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
