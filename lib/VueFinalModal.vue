<template>
  <div
    v-if="ssr || visible"
    v-show="!ssr || visible"
    ref="root"
    :style="{ zIndex: calculateZIndex }"
    class="vfm vfm--inset"
    :class="[
      attach === false ? 'vfm--fixed' : 'vfm--absolute',
      { 'vfm--prevent-none': preventClick }
    ]"
  >
    <transition
      :name="overlayTransition"
      @before-enter="beforeOverlayEnter"
      @after-enter="afterOverlayEnter"
      @before-leave="beforeOverlayLeave"
      @after-leave="afterOverlayLeave"
    >
      <div
        v-show="!hideOverlay && visibility.overlay"
        class="vfm__overlay vfm--overlay vfm--absolute vfm--inset"
        :class="overlayClass"
      ></div>
    </transition>
    <transition
      :name="transition"
      @before-enter="beforeModalEnter"
      @after-enter="afterModalEnter"
      @before-leave="beforeModalLeave"
      @after-leave="afterModalLeave"
    >
      <div
        v-show="visibility.modal"
        class="vfm__container vfm--absolute vfm--inset"
        :class="[classes, { 'vfm--cursor-pointer': clickToClose }]"
        @click="clickToClose && $emit('update:modelValue', false)"
      >
        <slot name="content-before" />
        <slot name="content">
          <div
            ref="vfmContent"
            body-scroll-lock-ignore
            class="vfm__content vfm--cursor-auto"
            :class="[contentClass, { 'vfm--prevent-auto': preventClick }]"
            @click.stop
          >
            <slot />
          </div>
        </slot>
        <slot name="content-after" />
      </div>
    </transition>
  </div>
</template>

<script setup="props, { emit }">
import modalStack from './modalStack'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import {
  ref,
  reactive,
  onMounted,
  onBeforeUnmount,
  computed,
  nextTick,
  watch
} from 'vue'

const TransitionState = {
  Enter: 'enter',
  Entering: 'entering',
  Leave: 'leave',
  Leaving: 'leavng'
}

export default {
  name: 'VueFinalModal',
  props: {
    modelValue: { type: Boolean, default: false },
    ssr: { type: Boolean, default: true },
    classes: { type: [String, Object, Array], default: '' },
    overlayClass: { type: [String, Object, Array], default: '' },
    contentClass: { type: [String, Object, Array], default: '' },
    lockScroll: { type: Boolean, default: true },
    hideOverlay: { type: Boolean, default: false },
    clickToClose: { type: Boolean, default: true },
    preventClick: { type: Boolean, default: false },
    attach: {
      type: null,
      default: false,
      validator(val) {
        const type = typeof val

        if (type === 'boolean' || type === 'string') return true

        return val.nodeType === Node.ELEMENT_NODE
      }
    },
    transition: { type: String, default: 'vfm' },
    overlayTransition: { type: String, default: 'vfm' },
    zIndexBase: { type: [String, Number], default: 1000 },
    zIndex: { type: [Boolean, String, Number], default: false }
  },
  emits: [
    'update:modelValue',
    'before-open',
    'opened',
    'before-close',
    'closed'
  ]
}

const uid = Symbol('vfm')
export const root = ref(null)
export const vfmContent = ref(null)

const modalStackIndex = ref(null)

export const visible = ref(false)
export const visibility = reactive({
  modal: false,
  overlay: false
})
const overlayTransitionState = ref(null)
const modalTransitionState = ref(null)

const isComponentReadyToBeDestroyed = computed(() => {
  return (
    (props.hideOverlay ||
      overlayTransitionState.value === TransitionState.Leave) &&
    modalTransitionState.value === TransitionState.Leave
  )
})

export const calculateZIndex = computed(() => {
  if (typeof props.zIndex === 'boolean') {
    if (props.attach) {
      return 'unset'
    } else {
      return props.zIndexBase + 2 * (modalStackIndex.value || 0)
    }
  } else {
    return props.zIndex
  }
})

watch(
  () => props.modelValue,
  value => {
    mounted()
    if (!value) {
      close()
    }
  }
)
watch(() => props.lockScroll, handleLockScroll)
watch(
  () => props.hideOverlay,
  value => {
    if (props.modelValue && !value) {
      visibility.overlay = true
    }
  }
)
watch(() => props.attach, mounted)
watch(
  isComponentReadyToBeDestroyed,
  val => {
    if (val) {
      visible.value = false
    }
  },
  {
    flush: 'post'
  }
)

onMounted(() => {
  mounted()
})
onBeforeUnmount(() => {
  close()
  root.value.remove()
})

function mounted() {
  if (props.modelValue) {
    let target = getAttachElement()
    if (target || props.attach === false) {
      props.attach !== false && target.appendChild(root.value)
      let index = modalStack.findIndex(vm => vm.uid === uid)
      if (index !== -1) {
        // if this is already exist in modalStack, delete it
        modalStack.splice(index, 1)
      }
      modalStack.push({
        uid,
        getAttachElement,
        modalStackIndex,
        visibility,
        handleLockScroll,
        hideOverlay: props.hideOverlay
      })
      modalStackIndex.value = modalStack.length - 1

      handleLockScroll()

      modalStack
        .filter(vm => vm.uid !== uid)
        .forEach((vm, index) => {
          if (vm.getAttachElement() === target) {
            // if vm and this have the same attach element
            vm.modalStackIndex.value = index
            vm.visibility.overlay = false
          }
        })

      visible.value = true
      nextTick(() => {
        startTransitionEnter()
      })
    } else if (target !== false) {
      console.warn('Unable to locate target '.concat(props.attach))
    }
  } else {
    props.lockScroll && enableBodyScroll(vfmContent.value)
  }
}
function close() {
  let index = modalStack.findIndex(vm => vm.uid === uid)
  if (index !== -1) {
    // remove this in modalStack
    modalStack.splice(index, 1)
  }
  if (modalStack.length > 0) {
    // If there are still nested modals opened
    const $_vm = modalStack[modalStack.length - 1]
    $_vm.handleLockScroll()
    !$_vm.hideOverlay && ($_vm.visibility.overlay = true)
  } else {
    // If the closed modal is the last one
    props.lockScroll && enableBodyScroll(vfmContent.value)
  }
  startTransitionLeave()
}
function handleLockScroll() {
  props.lockScroll
    ? disableBodyScroll(vfmContent.value, {
        allowTouchMove: el => {
          while (el && el !== document.body) {
            if (el.getAttribute('body-scroll-lock-ignore') !== null) {
              return true
            }
            el = el.parentElement
          }
        }
      })
    : enableBodyScroll(vfmContent.value)
}
function getAttachElement() {
  let target
  if (props.attach === false) {
    target = false
  } else if (typeof props.attach === 'string') {
    // CSS selector
    if (window) {
      target = window.document.querySelector(props.attach)
    } else {
      target = false
    }
  } else {
    // DOM Element
    target = props.attach
  }
  return target
}
function startTransitionEnter() {
  visibility.overlay = true
  visibility.modal = true
}
function startTransitionLeave() {
  visibility.overlay = false
  visibility.modal = false
}

export function beforeOverlayEnter() {
  overlayTransitionState.value = TransitionState.Entering
}
export function afterOverlayEnter() {
  overlayTransitionState.value = TransitionState.Enter
}
export function beforeOverlayLeave() {
  overlayTransitionState.value = TransitionState.Leaving
}
export function afterOverlayLeave() {
  overlayTransitionState.value = TransitionState.Leave
}
export function beforeModalEnter() {
  emit('before-open')
  modalTransitionState.value = TransitionState.Entering
}
export function afterModalEnter() {
  modalTransitionState.value = TransitionState.Enter
  emit('opened')
}
export function beforeModalLeave() {
  emit('before-close')
  modalTransitionState.value = TransitionState.Leaving
}
export function afterModalLeave() {
  modalTransitionState.value = TransitionState.Leave
  modalStackIndex.value = null
  emit('closed')
}
</script>

<style lang="css" scoped>
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
.vfm--cursor-pointer {
  cursor: pointer;
}
.vfm--cursor-auto {
  cursor: auto;
}
.vfm-enter-active,
.vfm-leave-active {
  transition: opacity 0.2s;
}
.vfm-enter-from,
.vfm-leave-to {
  opacity: 0;
}
</style>
