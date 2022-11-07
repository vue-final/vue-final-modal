<script setup>
import { ModalsContainer, VueFinalModal } from 'vue-final-modal'

const getInitialValues = () => ({
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
})

const options = ref(getInitialValues())

function reset() {
  options.value = getInitialValues()
}
</script>

<template>
  <div class="grid grid-cols-[150px_1fr] gap-y-2">
    <h3>modelValue:</h3>
    <input type="checkbox" v-model="options.modelValue" />

    <h3>hideOverlay:</h3>
    <input type="checkbox" v-model="options.hideOverlay" />

    <h3>clickToClose:</h3>
    <input type="checkbox" v-model="options.clickToClose" />

    <h3>escToClose:</h3>
    <input type="checkbox" v-model="options.escToClose" />

    <h3>lockScroll:</h3>
    <input type="checkbox" v-model="options.lockScroll" />

    <h3>displayDirective: </h3>
    <div class="flex space-x-4 whitespace-nowrap">
      <label for="if">
        <input type="radio" v-model="options.displayDirective" id="if" name="displayDirective" value="if" />
        if
      </label>
      <label for="show">
        <input type="radio" v-model="options.displayDirective" id="show" name="displayDirective" value="show" />
        show
      </label>
    </div>

    <h3>background: </h3>
    <div class="flex space-x-4 whitespace-nowrap">
      <label for="interactive">
        <input type="radio" v-model="options.background" id="interactive" name="background" value="interactive" />
        interactive
      </label>
      <label for="non-interactive">
        <input type="radio" v-model="options.background" id="non-interactive" name="background" value="non-interactive" />
        non-interactive
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