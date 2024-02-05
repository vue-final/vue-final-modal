<script setup lang="ts">
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, toRef, useAttrs, watch } from 'vue'
import { vueFinalModalProps } from './VueFinalModalProps'
import { useTransition } from './useTransition'
import { useToClose } from './useToClose'
import { useModelValue } from './useModelValue'
import { useFocusTrap } from './useFocusTrap'
import { useLockScroll } from './useBodyScrollLock'
import { useZIndex } from './useZIndex'
import { vVisible } from './vVisible'
import { arrayMoveItemToLast, arrayRemoveItem, noop, once } from '~/utils'
import { type ModalExposed } from '~/Modal'
import { useSwipeToClose } from '~/useSwipeToClose'
import { useVfm } from '~/useApi'
import { getModalExposed } from '~/plugin'

export interface VueFinalModalEmits {
  (e: 'update:modelValue', modelValue: boolean): void

  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}

const props = defineProps(vueFinalModalProps)
const emit = defineEmits<VueFinalModalEmits>()
const attrs = useAttrs()

defineOptions({ inheritAttrs: false })

const instance = getCurrentInstance()

defineSlots<{
  'default'?(props: { close: () => boolean }): void
  'swipe-banner'?(): void
}>()

const { modals, openedModals, openedModalOverlays } = useVfm()

const vfmRootEl = ref<HTMLDivElement>()
const vfmContentEl = ref<HTMLDivElement>()

const { focus, blur } = useFocusTrap(props, { focusEl: vfmRootEl })
const { zIndex, refreshZIndex, resetZIndex } = useZIndex(props)
const { modelValueLocal } = useModelValue(props, emit, { open, close })
const { enableBodyScroll, disableBodyScroll } = useLockScroll(props, {
  lockScrollEl: vfmRootEl,
  modelValueLocal,
})

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
    emit('opened')
    resolveToggle('opened')
  },
  onLeave() {
    arrayRemoveItem(openedModals, instance)
    resetZIndex()
    enableBodyScroll()
    emit('closed')
    resolveToggle('closed')
  },
})

const { onEsc, onMouseupRoot, onMousedown } = useToClose(props, emit, { vfmRootEl, vfmContentEl, visible, modelValueLocal })

const {
  swipeBannerEl,
  bindSwipe,
  onTouchStartSwipeBanner,
} = useSwipeToClose(props, { vfmContentEl, modelValueLocal })

const index = computed(() => instance ? openedModals.indexOf(instance) : -1)

watch([() => props.zIndexFn, index], () => {
  if (!visible.value)
    return
  refreshZIndex(index.value)
})

onMounted(() => {
  arrayMoveItemToLast(modals, instance)
})

if (props.modelValue)
  modelValueLocal.value = true

function open(): boolean {
  let shouldStop = false
  emit('beforeOpen', { stop: () => shouldStop = true })
  if (shouldStop)
    return false
  arrayMoveItemToLast(openedModals, instance)
  arrayMoveItemToLast(openedModalOverlays, instance)
  openLastOverlay()
  enterTransition()
  return true
}

function close(): boolean {
  let shouldStop = false
  emit('beforeClose', { stop: () => shouldStop = true })
  if (shouldStop)
    return false
  arrayRemoveItem(openedModalOverlays, instance)
  openLastOverlay()
  blur()
  leaveTransition()
  emit('update:modelValue', false)
  return true
}

onBeforeUnmount(() => {
  enableBodyScroll()
  arrayRemoveItem(modals, instance)
  arrayRemoveItem(openedModals, instance)
  blur()
  openLastOverlay()
})

async function openLastOverlay() {
  await nextTick()
  // Found the modals which has overlay and has `auto` overlayBehavior
  const openedModalsOverlaysAuto = openedModalOverlays.filter((modal) => {
    const modalExposed = getModalExposed(modal)
    return modalExposed?.value.overlayBehavior.value === 'auto' && !modalExposed?.value.hideOverlay?.value
  })
  // Only keep the last overlay open
  openedModalsOverlaysAuto.forEach((modal, index) => {
    const modalExposed = getModalExposed(modal)
    if (!modalExposed?.value)
      return
    modalExposed.value.overlayVisible.value = index === openedModalsOverlaysAuto.length - 1
  })
}

const modalId = toRef(() => props.modalId)
const hideOverlay = toRef(() => props.hideOverlay)
const overlayBehavior = toRef(() => props.overlayBehavior)
const modalExposed = computed<ModalExposed>(() => ({
  modalId,
  hideOverlay,
  overlayBehavior,
  overlayVisible,
  toggle(show?: boolean): Promise<string> {
    return new Promise((resolve) => {
      resolveToggle = once((res: string) => resolve(res))

      const value = typeof show === 'boolean' ? show : !modelValueLocal.value
      modelValueLocal.value = value
    })
  },
}))

defineExpose({
  modalExposed,
})
</script>

<template>
  <Teleport :to="teleportTo ? teleportTo : undefined" :disabled="!teleportTo">
    <div
      v-if="displayDirective !== 'if' || visible"
      v-show="displayDirective !== 'show' || visible"
      v-bind="attrs"
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
      <Transition v-if="!hideOverlay" v-bind="overlayTransition as object" v-on="overlayListeners">
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
      <Transition v-bind="contentTransition as object" v-on="contentListeners">
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
          <slot v-bind="{ close }" />

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
  </Teleport>
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
