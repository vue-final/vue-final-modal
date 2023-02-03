<script setup>
import { ModalsContainer, VueFinalModal } from 'vue-final-modal'

const getInitialValues = () => ({
  teleportTo: 'body',
  modelValue: false,
  displayDirective: 'if',
  hideOverlay: false,
  overlayTransition: 'vfm-fade',
  contentTransition: 'vfm-fade',
  clickToClose: true,
  escToClose: true,
  background: 'non-interactive',
  lockScroll: true,
  swipeToClose: 'none',
})

const options = ref(getInitialValues())

function reset() {
  options.value = getInitialValues()
}
</script>

<template>
  <div class="grid grid-cols-[150px_1fr] gap-y-2">
    <h3>modelValue:</h3>
    <label> <input v-model="options.modelValue" type="checkbox"> </label>

    <h3>displayDirective: </h3>
    <div class="flex flex-col">
      <label v-for="value in ['if', 'show']" :key="value" :for="value">
        <input :id="value" v-model="options.displayDirective" type="radio" name="displayDirective" :value="value">
        {{ value }}
      </label>
    </div>

    <h3>hideOverlay:</h3>
    <label> <input v-model="options.hideOverlay" type="checkbox"> </label>

    <h3>overlayTransition: </h3>
    <div class="flex flex-col">
      <label v-for="value in ['vfm-fade', 'vfm-slide-up', 'vfm-slide-right', 'vfm-slide-down', 'vfm-slide-left']" :key="`overlay_${value}`" :for="`overlay_${value}`">
        <input :id="`overlay_${value}`" v-model="options.overlayTransition" type="radio" name="overlayTransition" :value="value">
        {{ value }}
      </label>
    </div>

    <h3>contentTransition: </h3>
    <div class="flex flex-col">
      <label v-for="value in ['vfm-fade', 'vfm-slide-up', 'vfm-slide-right', 'vfm-slide-down', 'vfm-slide-left']" :key="`content_${value}`" :for="`content_${value}`">
        <input :id="`content_${value}`" v-model="options.contentTransition" type="radio" name="contentTransition" :value="value">
        {{ value }}
      </label>
    </div>

    <h3>clickToClose:</h3>
    <label> <input v-model="options.clickToClose" type="checkbox"> </label>

    <h3>escToClose:</h3>
    <label> <input v-model="options.escToClose" type="checkbox"> </label>

    <h3>background: </h3>
    <div class="flex flex-col">
      <label v-for="value in ['interactive', 'non-interactive']" :key="value" :for="value">
        <input :id="value" v-model="options.background" type="radio" name="background" :value="value">
        {{ value }}
      </label>
    </div>

    <h3>lockScroll:</h3>
    <label> <input v-model="options.lockScroll" type="checkbox"> </label>

    <h3>swipeToClose: </h3>
    <div class="flex flex-col">
      <label v-for="value in ['none', 'up', 'right', 'down', 'left']" :key="value" :for="value">
        <input :id="value" v-model="options.swipeToClose" type="radio" name="swipeToClose" :value="value">
        {{ value }}
      </label>
    </div>
  </div>

  <div class="mt-4 space-x-4">
    <button class="ml-auto" @click="options.modelValue = true">
      Open modal
    </button>
    <button @click="reset">
      Reset
    </button>
  </div>

  <VueFinalModal
    v-model="options.modelValue"
    :teleport-to="options.teleportTo"
    :display-directive="options.displayDirective"
    :hide-overlay="options.hideOverlay"
    :overlay-transition="options.overlayTransition"
    :content-transition="options.contentTransition"
    :click-to-close="options.clickToClose"
    :esc-to-close="options.escToClose"
    :background="options.background"
    :lock-scroll="options.lockScroll"
    :swipe-to-close="options.swipeToClose"
    class="flex justify-center items-center"
    content-class="max-w-xl mx-4 p-4 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg space-y-2"
  >
    <h1 class="text-xl">
      Hello World!
    </h1>
    <p>Magna deserunt nulla aliquip velit aute. Et occaecat elit nulla excepteur labore cupidatat. Duis culpa mollit commodo dolor qui Lorem qui laborum elit elit Lorem occaecat. Commodo eiusmod esse voluptate officia amet quis occaecat aliqua. Proident do irure amet ut occaecat dolor laboris consectetur.</p>
    <button @click="options.modelValue = false">
      Close
    </button>
  </VueFinalModal>

  <ModalsContainer />
</template>

<style scoped lang="css">
button {
  @apply px-2 py-1 border rounded;
}
</style>
