<script setup lang="ts">
import type { StyleValue } from 'vue'
import { ref, useAttrs, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import VueFinalModal from '../VueFinalModal/VueFinalModal.vue'
import { useSwipeable } from '~/swipeable'
import { clamp, noop } from '~/utils'

// TODO: extends props from VueFinalModal
const props = withDefaults(defineProps<{
  bottomSheetClass?: any
  bottomSheetStyle?: StyleValue
  closeDirection?: 'none' | 'DOWN'
  threshold?: number
}>(), {
  closeDirection: 'DOWN',
  threshold: 30,
})

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void
}>()

const vfmComp = ref<InstanceType<typeof VueFinalModal>>()

const LIMIT_DISTANCE = 0.1
const LIMIT_SPEED = 300

const attrs = useAttrs()
const bottomSheetEl = ref<HTMLDivElement>()
const offsetY = ref(0)
const isCollapsed = ref<boolean | undefined>(true)
let stopSelectionChange = noop
let shouldCloseModal = true
let swipeStart: number
let allowSwipe = false

const { lengthY, direction, isSwiping } = useSwipeable(bottomSheetEl, {
  threshold: props.threshold,
  onSwipeStart(e) {
    stopSelectionChange = useEventListener(document, 'selectionchange', () => {
      isCollapsed.value = window.getSelection()?.isCollapsed
    })
    swipeStart = new Date().getTime()
    allowSwipe = canSwipe(e?.target)
  },
  onSwipe() {
    if (!allowSwipe)
      return
    if (direction.value === props.closeDirection) {
      if (!isCollapsed.value)
        return
      offsetY.value = -clamp(Math.abs(lengthY.value), 0, bottomSheetEl.value?.offsetHeight || 0) + props.threshold
    }
  },
  onSwipeEnd(e, direction) {
    stopSelectionChange()
    if (!isCollapsed.value) {
      isCollapsed.value = true
      return
    }

    const swipeEnd = new Date().getTime()

    const validDirection = direction === props.closeDirection
    const validDistance = Math.abs(lengthY.value) > LIMIT_DISTANCE * (bottomSheetEl.value?.offsetHeight || 0)
    const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

    if (shouldCloseModal && allowSwipe && validDirection && (validDistance || validSpeed)) {
      offsetY.value = 0
      emit('update:modelValue', false)
      return
    }

    offsetY.value = 0
  },
})

watch(
  () => attrs.modelValue,
  (val) => {
    if (val)
      offsetY.value = 0
  },
)

watch(
  () => isCollapsed.value,
  (val) => {
    if (!val)
      offsetY.value = 0
  },
)

watch(
  () => offsetY.value,
  (newValue, oldValue) => {
    if (props.closeDirection === 'DOWN')
      shouldCloseModal = newValue < oldValue
  },
)

function canSwipe(target?: null | EventTarget): boolean {
  const allow = (target as HTMLElement)?.scrollTop === 0
  if (target === bottomSheetEl.value)
    return allow

  else
    return allow && canSwipe((target as HTMLElement)?.parentElement)
}
</script>

<template>
  <VueFinalModal
    ref="vfmComp"
    v-bind="attrs"
    :transition="{ name: 'vfm-slide-down' }"
    class="vfm-bottom-sheet"
    @mousedown.stop
    @touchstart.stop.passive
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <slot name="prepend" />
    <div
      ref="bottomSheetEl"
      class="vfm-bottom-sheet-content"
      :class="[{ 'vfm-bounce-back': !isSwiping }, bottomSheetClass]"
      :style="[{ transform: `translateY(${-offsetY}px)` }, bottomSheetStyle || {}]"
    >
      <slot />
    </div>
    <slot name="append" />
  </VueFinalModal>
</template>

<style lang="scss">
.vfm-bottom-sheet {
  .vfm__content {
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-height: 90%;
  }
  .vfm-bottom-sheet-content {
    overflow-y: auto;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }

  .vfm-bounce-back {
    transition-property: transform;
    transition-duration: .25s;
  }

  .vfm-slide-down-enter-active,
  .vfm-slide-down-leave-active {
    transition: transform .3s ease;
  }
  .vfm-slide-down-enter-from,
  .vfm-slide-down-leave-to {
    transform: translateY(100%);
  }
}
</style>
