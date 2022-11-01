<script setup lang="ts">
import type { TransitionProps } from 'vue'
import { ModalsContainer, VueFinalModal } from 'vue-final-modal'

const initValues = {
  teleportTo: 'body',
  modelValue: false,
  displayDirective: 'if',
  hideOverlay: false,
  overlayTransition: { name: 'vfm' },
  contentTransition: { name: 'vfm' },
  clickToClose: true,
  escToClose: true,
  background: 'non-interactive',
  lockScroll: true,
} as const

const modalId = Symbol('modalId')

const modelValue = ref<boolean>(initValues.modelValue)
const teleportTo = ref<string>(initValues.teleportTo)
const displayDirective = ref<'if' | 'show'>(initValues.displayDirective)
const hideOverlay = ref(initValues.hideOverlay)
const overlayTransition = ref<TransitionProps>(initValues.overlayTransition)
const contentTransition = ref<TransitionProps>(initValues.contentTransition)
const clickToClose = ref(initValues.clickToClose)
const escToClose = ref(initValues.escToClose)
const background = ref<'non-interactive' | 'interactive'>(initValues.background)
const lockScroll = ref(initValues.lockScroll)

function reset() {
  modelValue.value = initValues.modelValue
  teleportTo.value = initValues.teleportTo
  displayDirective.value = initValues.displayDirective
  hideOverlay.value = initValues.hideOverlay
  overlayTransition.value = initValues.overlayTransition
  contentTransition.value = initValues.contentTransition
  clickToClose.value = initValues.clickToClose
  escToClose.value = initValues.escToClose
  background.value = initValues.background
  lockScroll.value = initValues.lockScroll
}
</script>

<template>
  <div class="grid grid-cols-[150px_1fr] gap-y-2">
    <h3>modelValue:</h3>
    <NSwitch v-model="modelValue" />

    <h3>hideOverlay:</h3>
    <NSwitch v-model="hideOverlay" />

    <h3>clickToClose:</h3>
    <NSwitch v-model="clickToClose" />

    <h3>escToClose:</h3>
    <NSwitch v-model="escToClose" />

    <h3>lockScroll:</h3>
    <NSwitch v-model="lockScroll" />

    <h3>displayDirective: </h3>
    <div class="flex space-x-4 whitespace-nowrap">
      <NRadio v-model="displayDirective" name="name" value="if">
        if
      </NRadio>
      <NRadio
        v-model="displayDirective"
        name="name"
        value="show"
      >
        show
      </NRadio>
    </div>

    <h3>background: </h3>
    <div class="flex space-x-4 whitespace-nowrap">
      <NRadio v-model="background" name="name" value="interactive">
        interactvie
      </NRadio>
      <NRadio
        v-model="background"
        name="name"
        value="non-interactive"
      >
        non-interactvie
      </NRadio>
    </div>
  </div>

  <div class="mt-4 space-x-4">
    <NButton n="sm" class="ml-auto" @click="modelValue = true">
      Open modal
    </NButton>
    <NButton n="sm" @click="reset">
      Reset
    </NButton>
  </div>

  <VueFinalModal
    v-model="modelValue"
    :modal-id="modalId"
    :teleport-to="teleportTo"
    :display-directive="displayDirective"
    :hide-overlay="hideOverlay"
    :overlay-transition="overlayTransition"
    :content-transition="contentTransition"
    :click-to-close="clickToClose"
    :esc-to-close="escToClose"
    :background="background"
    :lock-scroll="lockScroll"
    class="flex justify-center items-center"
    content-class="max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
  >
    <h1 class="text-xl">
      Hello World!
    </h1>
    <p>Magna deserunt nulla aliquip velit aute. Et occaecat elit nulla excepteur labore cupidatat. Duis culpa mollit commodo dolor qui Lorem qui laborum elit elit Lorem occaecat. Commodo eiusmod esse voluptate officia amet quis occaecat aliqua. Proident do irure amet ut occaecat dolor laboris consectetur.</p>
    <NButton @click="modelValue = false">
      Close
    </NButton>
  </VueFinalModal>

  <ModalsContainer />
</template>
