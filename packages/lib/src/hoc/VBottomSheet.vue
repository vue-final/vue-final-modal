<template>
  <vue-final-modal
    v-bind="attrs"
    :transition="{
      'enter-active-class': 'slideInDown',
      'leave-active-class': 'slideOutDown'
    }"
    @mousedown.stop
    @touchstart.stop.passive
    @closed="looseFocus"
  >
    <slot name="prepend"></slot>
    <div
      ref="bottomSheetEl"
      class="vfm-bottom-sheet"
      :class="{ 'vfm-transition': !isSwiping }"
      :style="{ transform: `translateY(${-offsetY}px)` }"
    >
      <slot></slot>
    </div>
    <slot name="append"></slot>
  </vue-final-modal>
</template>

<script>
export default {
  inheritAttrs: false
}
</script>

<script setup>
import { ref, useAttrs, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useSwipeable } from '../utils/swipeable'
import { VueFinalModal } from '../modalInstance'
import { looseFocus } from '../utils/dom'
import { noop } from '../utils'

function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val
}

const LIMIT_DISTANCE = 0.1
const LIMIT_SPEED = 300

const props = defineProps({
  swipeToCloseDirection: {
    type: String,
    default: '',
    validator(val) {
      return ['', 'DOWN'].includes(val) !== -1
    }
  },
  threshold: { type: Number, default: 30 }
})

const attrs = useAttrs()
const emit = defineEmits()

const bottomSheetEl = ref(null)
const offsetY = ref(0)
const isCollapsed = ref(true)
let stopSelectionChange = noop
let shouldCloseModal = true
let swipeStart = null
let allowSwipe = false

const { lengthY, direction, isSwiping } = useSwipeable(bottomSheetEl, {
  threshold: props.threshold,
  onSwipeStart(e) {
    stopSelectionChange = useEventListener(document, 'selectionchange', () => {
      isCollapsed.value = window.getSelection().isCollapsed
    })
    swipeStart = new Date().getTime()
    allowSwipe = canSwipe(e.target)
  },
  onSwipe() {
    if (!allowSwipe) return
    if (direction.value === props.swipeToCloseDirection) {
      if (!isCollapsed.value) return
      offsetY.value = -clamp(Math.abs(lengthY.value), 0, bottomSheetEl.value.offsetHeight) + props.threshold
    }
  },
  onSwipeEnd(event, direction) {
    stopSelectionChange()
    if (!isCollapsed.value) {
      isCollapsed.value = true
      return
    }

    const swipeEnd = new Date().getTime()

    const validDirection = direction === props.swipeToCloseDirection
    const validDistance = Math.abs(lengthY.value) > LIMIT_DISTANCE * bottomSheetEl.value.offsetHeight
    const validSpeed = swipeEnd - swipeStart <= LIMIT_SPEED

    if (shouldCloseModal && allowSwipe && validDirection && (validDistance || validSpeed)) {
      // eslint-disable-next-line vue/require-explicit-emits
      emit('update:modelValue', false)
      return
    }

    offsetY.value = 0
  }
})

watch(
  () => attrs.modelValue,
  val => {
    if (val) {
      offsetY.value = 0
    }
  }
)

watch(
  () => isCollapsed.value,
  val => {
    if (!val) {
      offsetY.value = 0
    }
  }
)

watch(
  () => offsetY.value,
  (newValue, oldValue) => {
    if (props.swipeToCloseDirection === 'DOWN') {
      shouldCloseModal = newValue < oldValue
    }
  }
)

function canSwipe(target) {
  const allow = target.scrollTop === 0
  if (target === bottomSheetEl.value) {
    return allow
  } else {
    return allow && canSwipe(target.parentElement)
  }
}
</script>

<style scoped>
.vfm-bottom-sheet {
  position: absolute;
  bottom: 0;
  width: 100%;
  max-height: 90%;
  overflow-y: auto;
  background-color: #fff;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.vfm-transition {
  transition-property: transform;
  transition-duration: 150ms;
}

@keyframes slideInDown {
  from {
    transform: translate3d(0, 100%, 0);
  }

  to {
    transform: translate3d(0, 0, 0);
  }
}

:deep(.slideInDown) {
  animation-name: slideInDown;
  animation-duration: 0.3s;
}

@keyframes slideOutDown {
  from {
    transform: translate3d(0, 0, 0);
  }

  to {
    transform: translate3d(0, 100%, 0);
  }
}

:deep(.slideOutDown) {
  animation-name: slideOutDown;
  animation-duration: 0.3s;
}
</style>
