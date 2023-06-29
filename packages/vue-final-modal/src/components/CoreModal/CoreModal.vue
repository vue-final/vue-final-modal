<script setup lang="ts">
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { coreModalProps } from './CoreModalProps'
import { useTransition } from './useTransition'
import { useToClose } from './useToClose'
import { useModelValue } from './useModelValue'
import { useFocusTrap } from './useFocusTrap'
import { useLockScroll } from './useBodyScrollLock'
import { useEvent } from './useEvent'
import { useZIndex } from './useZIndex'
import { vVisible } from './vVisible'
import { noop, once } from '~/utils'
import type { InternalVfm, Modal, Vfm } from '~/Modal'
import { useSwipeToClose } from '~/useSwipeToClose'

import { internalVfmSymbol, vfmSymbol } from '~/injectionSymbols'

export interface CoreModalEmits {
  (e: 'update:modelValue', modelValue: boolean): void

  (e: 'beforeOpen'): void
  (e: 'opened'): void
  (e: 'beforeClose'): void
  (e: 'closed'): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}

const props = defineProps(coreModalProps)
const emit = defineEmits<CoreModalEmits>()

const { modals, openedModals } = inject(vfmSymbol, {
  modals: [],
  openedModals: [],
} as any as Vfm)

const {
  openLastOverlay,
  moveToLastOpenedModals,
  deleteFromOpenedModals,
  moveToLastOpenedModalOverlays,
  deleteFromOpenedModalOverlays,
  deleteFromModals,
} = inject(internalVfmSymbol, {
  openLastOverlay: noop,
  moveToLastOpenedModals: noop,
  deleteFromOpenedModals: noop,
  moveToLastOpenedModalOverlays: noop,
  deleteFromOpenedModalOverlays: noop,
  deleteFromModals: noop,
} as any as InternalVfm)

const vfmRootEl = ref<HTMLDivElement>()
const vfmContentEl = ref<HTMLDivElement>()

const { focus, blur } = useFocusTrap(props, { focusEl: vfmRootEl })
const { zIndex, refreshZIndex, resetZIndex } = useZIndex(props)
const { modelValueLocal } = useModelValue(props, emit)
const { enableBodyScroll, disableBodyScroll } = useLockScroll(props, {
  lockScrollEl: vfmRootEl,
  modelValueLocal,
})
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
  modelValueLocal,
  onEntering() {
    nextTick(() => {
      disableBodyScroll()
      focus()
    })
  },
  onEnter() {
    emitEvent('opened')
    resolveToggle('opened')
  },
  onLeave() {
    deleteFromOpenedModals(getModalInstance())
    resetZIndex()
    enableBodyScroll()
    emitEvent('closed')
    resolveToggle('closed')
  },
})

const { onEsc, onMouseupRoot, onMousedown } = useToClose(props, emit, { vfmRootEl, vfmContentEl, visible, modelValueLocal })

const {
  swipeBannerEl,
  bindSwipe,
  onTouchStartSwipeBanner,
} = useSwipeToClose(props, { vfmContentEl, modelValueLocal })

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

function getModalInstance() {
  return modalInstance
}

const index = computed(() => openedModals.indexOf(modalInstance))

watch(() => [props.zIndexFn, index.value], () => {
  if (visible.value)
    refreshZIndex(index.value)
})

onMounted(() => {
  modals.push(modalInstance)
})

if (modelValueLocal.value)
  open()

watch(modelValueLocal, (value) => {
  value ? open() : close()
})

async function open() {
  emitEvent('beforeOpen')
  moveToLastOpenedModals(modalInstance)
  moveToLastOpenedModalOverlays(modalInstance)
  refreshZIndex(index.value)
  openLastOverlay()
  enterTransition()
}

function close() {
  emitEvent('beforeClose')
  deleteFromOpenedModalOverlays(modalInstance)
  openLastOverlay()
  blur()
  leaveTransition()
}

onBeforeUnmount(() => {
  enableBodyScroll()
  deleteFromModals(modalInstance)
  deleteFromOpenedModals(modalInstance)
  deleteFromOpenedModalOverlays(modalInstance)
  blur()
  openLastOverlay()
})
</script>

<template>
  <div
    v-if="displayDirective !== 'if' || visible"
    v-show="displayDirective !== 'show' || visible"
    ref="vfmRootEl"
    v-visible="displayDirective !== 'visible' || visible"
    class="vfm vfm--fixed vfm--inset"
    :class="{ 'vfm--prevent-none': background === 'interactive' }"
    :style="{ zIndex }"
    role="dialog"
    aria-modal="true"
    @keydown.esc="() => onEsc()"
    @mouseup.self="() => onMouseupRoot()"
    @mousedown.self="e => onMousedown(e)"
  >
    <Transition v-if="!hideOverlay" v-bind="overlayTransition" :appear="true" v-on="overlayListeners">
      <div
        v-if="displayDirective !== 'if' || overlayVisible"
        v-show="displayDirective !== 'show' || overlayVisible"
        v-visible="displayDirective !== 'visible' || overlayVisible"
        class="vfm__overlay vfm--overlay vfm--absolute vfm--inset vfm--prevent-none"
        :class="overlayClass"
        :style="overlayStyle"
        aria-hidden="true"
      />
    </Transition>
    <Transition v-bind="contentTransition" :appear="true" v-on="contentListeners">
      <div
        v-if="displayDirective !== 'if' || contentVisible"
        v-show="displayDirective !== 'show' || contentVisible"
        ref="vfmContentEl"
        v-visible="displayDirective !== 'visible' || contentVisible"
        class="vfm__content vfm--outline-none"
        :class="[contentClass, { 'vfm--prevent-auto': background === 'interactive' }]"
        :style="contentStyle"
        tabindex="0"
        v-bind="bindSwipe"
        @mousedown="() => onMousedown()"
      >
        <slot />

        <div
          v-if="showSwipeBanner"
          ref="swipeBannerEl"
          class="vfm-swipe-banner-container"
          @touchstart="e => onTouchStartSwipeBanner(e)"
        >
          <slot name="swipe-banner">
            <div class="vfm-swipe-banner-back" @touchstart="e => swipeToClose === 'left' && e.preventDefault()" />
            <div class="vfm-swipe-banner-forward" @touchstart="e => swipeToClose === 'right' && e.preventDefault()" />
          </slot>
        </div>
        <div
          v-else-if="!showSwipeBanner && preventNavigationGestures"
          class="vfm-swipe-banner-container"
          @touchstart="e => onTouchStartSwipeBanner(e)"
        >
          <div class="vfm-swipe-banner-back" @touchstart="e => swipeToClose === 'left' && e.preventDefault()" />
          <div class="vfm-swipe-banner-forward" @touchstart="e => swipeToClose === 'right' && e.preventDefault()" />
        </div>
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
  z-index: -1;
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

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fade-out {
  from { opacity: 1 }
  to { opacity: 0 }
}

.vfm-fade-enter-active {
  animation: fade-in .3s ease;
}
.vfm-fade-leave-active {
  animation: fade-out .3s ease;
}
.vfm-bounce-back {
  transition-property: transform;
  transition-duration: .3s;
}

.vfm-slide-up-enter-active,
.vfm-slide-up-leave-active,
.vfm-slide-down-enter-active,
.vfm-slide-down-leave-active {
  transition: transform .3s ease;
}
.vfm-slide-down-enter-from,
.vfm-slide-down-leave-to {
  transform: translateY(100vh) !important;
}
.vfm-slide-up-enter-from,
.vfm-slide-up-leave-to {
  transform: translateY(-100vh) !important;
}

.vfm-slide-right-enter-active,
.vfm-slide-right-leave-active,
.vfm-slide-left-enter-active,
.vfm-slide-left-leave-active {
  transition: transform .3s ease;
}
.vfm-slide-right-enter-from,
.vfm-slide-right-leave-to {
  transform: translateX(100vw) !important;
}
.vfm-slide-left-enter-from,
.vfm-slide-left-leave-to {
  transform: translateX(-100vw) !important;
}

.vfm-swipe-banner-back,
.vfm-swipe-banner-forward {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 27px;
  z-index: 10;
}
.vfm-swipe-banner-back {
  left: 0;
}
.vfm-swipe-banner-forward {
  right: 0;
}
</style>
