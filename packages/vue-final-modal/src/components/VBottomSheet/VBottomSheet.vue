<script lang="ts">
import type { TransitionProps } from 'vue'
import { computed, ref, useAttrs, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import VueFinalModal from '../VueFinalModal/VueFinalModal.vue'
import { useEmits } from '../CoreModal/CoreModalEmits'
import { vueFinalModalProps } from '../VueFinalModal/VueFinalModalProps'
import { coreModalProps } from '../CoreModal/CoreModalProps'
import { vBottomSheetProps } from './VBottomSheetProps'
import { useSwipeable } from '~/useSwipeable'
import { clamp, noop } from '~/utils'

export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = defineProps({
  ...vBottomSheetProps,
  ...vueFinalModalProps,
  ...coreModalProps,
})

const emit = defineEmits<{
  /** Public events */
  (e: 'beforeClose'): void
  (e: 'closed'): void
  (e: 'beforeOpen'): void
  (e: 'opened'): void
  (e: 'update:modelValue', modelValue: boolean): void

  /** onClickOutside will only be emitted when clickToClose equal to `false` */
  (e: 'clickOutside'): void
}>()

const bindProps = computed(() => {
  const _props: any = { ...props }
  const keys = Object.keys(vBottomSheetProps)
  keys.forEach((key) => {
    delete _props[key]
  })
  return _props
})

const bindEmits = useEmits(emit)
const attrs = useAttrs()

const LIMIT_DISTANCE = 0.1
const LIMIT_SPEED = 300

const contentEl = ref<HTMLDivElement>()
const offsetY = ref(0)
const isCollapsed = ref<boolean | undefined>(true)
let stopSelectionChange = noop
let shouldCloseModal = true
let swipeStart: number
let allowSwipe = false

const transition = computed<undefined | TransitionProps>(() => {
  if (props.closeDirection === 'DOWN')
    return { name: 'vfm-slide-down' }
  else
    return props.transition
})

const { lengthY, direction, isSwiping } = props.closeDirection !== 'none'
  ? useSwipeable(contentEl, {
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
      if (direction?.value === props.closeDirection) {
        if (!isCollapsed.value)
          return
        offsetY.value = -clamp(Math.abs(lengthY?.value || 0), 0, contentEl.value?.offsetHeight || 0) + props.threshold
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
      const validDistance = Math.abs(lengthY?.value || 0) > LIMIT_DISTANCE * (contentEl.value?.offsetHeight || 0)
      const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

      if (shouldCloseModal && allowSwipe && validDirection && (validDistance || validSpeed)) {
        offsetY.value = 0
        emit('update:modelValue', false)
        return
      }

      offsetY.value = 0
    },
  })
  : {
      lengthY: undefined,
      direction: undefined,
      isSwiping: undefined,
    }

watch(
  () => props.modelValue,
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
  if (target === contentEl.value)
    return allow

  else
    return allow && canSwipe((target as HTMLElement)?.parentElement)
}
</script>

<template>
  <VueFinalModal
    v-bind="{
      ...bindProps,
      transition,
      ...bindEmits,
      ...attrs,
    }"
    class="vfm-bottom-sheet"
  >
    <div
      ref="contentEl"
      class="vfm-bottom-sheet-content"
      :class="[{ 'vfm-bounce-back': !isSwiping }, bottomSheetClass]"
      :style="[{ transform: `translateY(${-offsetY}px)` }, bottomSheetStyle || {}]"
    >
      <slot />
    </div>
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
