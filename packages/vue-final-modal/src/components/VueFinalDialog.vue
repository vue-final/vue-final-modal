<script setup lang="ts">
import type { ModalComponentEmits, ModalExposed } from '~/types'
import { lockScroll, unlockScroll } from '@hunterliu/scroll-lock'
import { computed, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue'
import { useModalLifecycle } from '~/composables/useModalLifecycle'
import { vfmResolver } from '~/plugin'
import { vueFinalDialogProps } from '~/types'
import { arrayMoveItemToLast, arrayRemoveItem } from '~/utils'

const props = defineProps(vueFinalDialogProps)
const emit = defineEmits<ModalComponentEmits>()
defineSlots<{
  default?: (props: { close: () => void }) => void
}>()

const dialogEl = ref<HTMLDialogElement>()
const { isOpen, reportClosed, toggle } = useModalLifecycle(props, emit, { open: show, close: hide })

/** Only vfm.open(modalId), vfm.close(modalId) and closeAll() need a vfm: a dialog works without one. */
const vfm = vfmResolver.resolve()
const exposed: ModalExposed = {
  modalId: toRef(() => props.modalId),
  hideOverlay: ref(true),
  overlayBehavior: ref<'auto' | 'persist'>('auto'),
  overlayVisible: ref(false),
  toggle,
}
const modalExposed = computed(() => exposed)

let scrollLocked = false

watch(() => props.lockScroll, lock => lock && isOpen.value ? lockPageScroll() : unlockPageScroll())

onMounted(() => {
  if (vfm)
    arrayMoveItemToLast(vfm.modals, modalExposed)
})

onBeforeUnmount(() => {
  if (vfm) {
    arrayRemoveItem(vfm.modals, modalExposed)
    arrayRemoveItem(vfm.openedModals, modalExposed)
  }
  unlockPageScroll()
})

async function show() {
  const el = dialogEl.value!
  if (vfm)
    arrayMoveItemToLast(vfm.openedModals, modalExposed)
  if (!el.open)
    props.modal ? el.showModal() : el.show()
  if (props.lockScroll)
    lockPageScroll()
  await animationsFinished(el)
}

async function hide() {
  const el = dialogEl.value!
  if (el.open)
    el.close()
  await animationsFinished(el)
  /** Shown again while it was closing. */
  if (isOpen.value)
    return
  if (vfm)
    arrayRemoveItem(vfm.openedModals, modalExposed)
  unlockPageScroll()
}

/** A close request, by Esc or `closedby`: the browser closes the dialog after this event unless beforeClose stopped it. */
function onCancel(event: Event) {
  isOpen.value = false
  if (isOpen.value)
    event.preventDefault()
}

/** Also fired for a close no cancel asked about first, such as a form with `method="dialog"`. A dialog shown again before this event fired stays open. */
function onClose() {
  if (!dialogEl.value?.open)
    reportClosed()
}

function close() {
  isOpen.value = false
}

function lockPageScroll() {
  if (scrollLocked)
    return
  scrollLocked = true
  lockScroll(document.body, { reserveScrollBarGap: true })
}

function unlockPageScroll() {
  if (!scrollLocked)
    return
  scrollLocked = false
  unlockScroll(document.body)
}

/**
 * Waits for the transitions and animations of the dialog and its `::backdrop`, such as `@starting-style` ones.
 * `subtree` is what reaches the `::backdrop`; the content's own animations and endless ones are not waited for.
 */
function animationsFinished(el: HTMLDialogElement) {
  const animations = el.getAnimations?.({ subtree: true }).filter((animation) => {
    const effect = animation.effect as KeyframeEffect | null
    return effect?.target === el && effect.getComputedTiming().endTime !== Infinity
  }) ?? []
  return Promise.allSettled(animations.map(animation => animation.finished))
}
</script>

<template>
  <dialog ref="dialogEl" :closedby="closedby" @cancel="onCancel" @close="onClose">
    <slot :close="close" />
  </dialog>
</template>
