<script setup lang="ts">
import { computed, h, nextTick, onBeforeUnmount, onMounted, ref, useAttrs } from 'vue'
import { vueFinalModalProps } from '~/types'
import { useTransition } from '~/composables/useTransition'
import { VfmLayer } from '~/components/VfmLayer'
import { useToClose } from '~/composables/useToClose'
import { useModelValue } from '~/composables/useModelValue'
import { useFocusTrap } from '~/composables/useFocusTrap'
import { useLockScroll } from '~/composables/useLockScroll'
import { useZIndex } from '~/composables/useZIndex'
import { vVisible } from '~/composables/vVisible'
import { useInternalExposed } from '~/composables/useInternalExposed'
import { arrayMoveItemToLast, arrayRemoveItem } from '~/utils'
import { useSwipeToClose } from '~/composables/useSwipeToClose'
import { useVfm } from '~/composables/useVfm'

export interface VueFinalModalEmits {
  (e: 'update:modelValue', modelValue: boolean): void

  (e: 'beforeOpen', event: { stop: () => void }): void
  (e: 'opened'): void
  (e: 'beforeClose', event: { stop: () => void }): void
  (e: 'closed'): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void

  /** Internal event, only used in ModalsProvider */
  (e: '_opened'): void
  /** Internal event, only used in ModalsProvider */
  (e: '_closed'): void
}

const props = defineProps(vueFinalModalProps)
const emit = defineEmits<VueFinalModalEmits>()
const attrs = useAttrs()

defineSlots<{
  'default'?(props: { close: () => void }): void
  'swipe-banner'?(): void
}>()

const { modals, openedModals, openedModalOverlays } = useVfm()

const vfmRootEl = ref<HTMLDivElement>()
const contentLayer = ref<{ el?: HTMLDivElement }>()
const vfmContentEl = computed(() => contentLayer.value?.el)

const { focus, blur } = useFocusTrap(props, { focusEl: vfmRootEl })
const { modelValueLocal } = useModelValue(props, emit, { open, close })
const { disableScroll, enableScroll } = useLockScroll(props, { rootEl: vfmRootEl, modelValueLocal })

const {
  visible,
  contentVisible, contentListeners, contentTransition,
  overlayVisible, overlayShown, overlayListeners, overlayTransition,
  enter, leave,
} = useTransition(props, {
  onOpening,
  onOpen,
  onClosed,
})

const { modalExposed, resolveToggle } = useInternalExposed(props, { modelValueLocal, overlayVisible })
const { zIndex, resetZIndex } = useZIndex(props, { visible, modalExposed, openedModals })
const { onEsc, onMouseupRoot, onMousedown } = useToClose(props, emit, { vfmRootEl, vfmContentEl, visible, modelValueLocal })
const swipeBannerEl = ref<HTMLDivElement>()
const { bindSwipe, onTouchStartSwipeBanner } = useSwipeToClose(props, { vfmContentEl, swipeBannerEl, modelValueLocal })

if (props.modelValue)
  modelValueLocal.value = true

onMounted(() => {
  arrayMoveItemToLast(modals, modalExposed)
})

onBeforeUnmount(() => {
  enableScroll()
  arrayRemoveItem(modals, modalExposed)
  arrayRemoveItem(openedModals, modalExposed)
  arrayRemoveItem(openedModalOverlays, modalExposed)
  blur()
  openLastOverlay()
})

function onOpening() {
  disableScroll()
  focus()
}

function onOpen() {
  emit('opened')
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('_opened')
  resolveToggle('opened')
}

function onClosed() {
  arrayRemoveItem(openedModals, modalExposed)
  resetZIndex()
  enableScroll()
  emit('closed')
  // eslint-disable-next-line vue/custom-event-name-casing
  emit('_closed')
  resolveToggle('closed')
}

function open(): boolean {
  let shouldStop = false
  emit('beforeOpen', { stop: () => shouldStop = true })
  if (shouldStop)
    return false
  arrayMoveItemToLast(openedModals, modalExposed)
  arrayMoveItemToLast(openedModalOverlays, modalExposed)
  overlayVisible.value = true
  openLastOverlay()
  enter()
  return true
}

function close(): boolean {
  let shouldStop = false
  emit('beforeClose', { stop: () => shouldStop = true })
  if (shouldStop)
    return false
  arrayRemoveItem(openedModalOverlays, modalExposed)
  openLastOverlay()
  blur()
  leave()
  return true
}

function closeFromSlot() {
  modelValueLocal.value = false
}

const SwipeBanners = () => [
  h('div', { class: 'vfm-swipe-banner-back', onTouchstart: (e: TouchEvent) => props.swipeToClose === 'left' && e.preventDefault() }),
  h('div', { class: 'vfm-swipe-banner-forward', onTouchstart: (e: TouchEvent) => props.swipeToClose === 'right' && e.preventDefault() }),
]

/** With overlayBehavior 'auto', only the topmost open modal shows its overlay. */
async function openLastOverlay() {
  await nextTick()
  const autoOverlays = openedModalOverlays.filter(modal => modal.value.overlayBehavior.value === 'auto' && !modal.value.hideOverlay.value)
  autoOverlays.forEach((modal, index) => {
    modal.value.overlayVisible.value = index === autoOverlays.length - 1
  })
}
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <!-- The server renderer drops a Teleport without `to` even when it is disabled, so a disabled one still gets a target. -->
  <Teleport :to="teleportTo || 'body'" :disabled="!teleportTo">
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
      @keydown.esc="onEsc"
      @mouseup.self="onMouseupRoot"
      @mousedown.self="onMousedown"
    >
      <Transition v-if="!hideOverlay" v-bind="overlayTransition as object" v-on="overlayListeners">
        <VfmLayer
          :shown="overlayShown"
          :keep-layout="displayDirective === 'visible'"
          class="vfm__overlay vfm--overlay vfm--absolute vfm--inset vfm--prevent-none"
          :class="overlayClass"
          :style="overlayStyle"
          aria-hidden="true"
        />
      </Transition>
      <Transition v-bind="contentTransition as object" v-on="contentListeners">
        <VfmLayer
          ref="contentLayer"
          :shown="contentVisible"
          :keep-layout="displayDirective === 'visible'"
          class="vfm__content vfm--outline-none"
          :class="[contentClass, { 'vfm--prevent-auto': background === 'interactive' }]"
          :style="contentStyle"
          tabindex="0"
          v-bind="bindSwipe"
          @mousedown="onMousedown"
        >
          <slot :close="closeFromSlot" />

          <div
            v-if="showSwipeBanner || preventNavigationGestures"
            ref="swipeBannerEl"
            class="vfm-swipe-banner-container"
            @touchstart="onTouchStartSwipeBanner"
          >
            <slot v-if="showSwipeBanner" name="swipe-banner">
              <SwipeBanners />
            </slot>
            <SwipeBanners v-else />
          </div>
        </VfmLayer>
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
