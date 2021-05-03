<template>
  <div class="pb-8">
    <v-modal
      v-model="showModal"
      :ssr="ssr"
      :lock-scroll="lockScroll"
      :hide-overlay="hideOverlay"
      :click-to-close="clickToClose"
      :esc-to-close="escToClose"
      :prevent-click="preventClick"
      :transition="transition ? 'vfm' : ''"
      :overlay-transition="overlayTransition ? 'vfm' : ''"
      :z-index-auto="zIndexAuto"
      :z-index-base="zIndexBase"
      :z-index="allowZIndex ? zIndex : false"
      :attach="attach ? '#attach' : false"
      :focus-retain="focusRetain"
      :focus-trap="focusTrap"
      @confirm="showModal = false"
      @cancel="showModal = false"
    >
      <template #title># Hello, world!</template>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
      </p>
    </v-modal>

    <button class="vfm-btn" @click="showModal = true">Open Modal</button>

    <h3>Prop Options:</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded">
      <label class="flex items-center space-x-2">
        <span>value:</span>
        <input v-model="showModal" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>ssr:</span>
        <input v-model="ssr" type="checkbox" />
      </label>

      <label class="flex items-center space-x-2">
        <span>lockScroll:</span>
        <input v-model="lockScroll" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>hideOverlay:</span>
        <input v-model="hideOverlay" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>clickToClose:</span>
        <input v-model="clickToClose" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>escToClose:</span>
        <input v-model="escToClose" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>preventClick:</span>
        <input v-model="preventClick" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>transition:</span>
        <input v-model="transition" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>overlayTransition:</span>
        <input v-model="overlayTransition" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>zIndexAuto:</span>
        <input v-model="zIndexAuto" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>zIndexBase:</span>
        <input v-model="zIndexBase" class="w-20 pl-2 dark:text-black rounded focus:outline-none" type="number" />
      </label>
      <div class="flex items-center space-x-2">
        <label class="flex items-center space-x-2">
          <input v-model="allowZIndex" type="checkbox" />
          <span>zIndex:</span>
        </label>
        <label>
          <input
            v-model="zIndex"
            type="number"
            class="w-20 pl-2 dark:text-black rounded focus:outline-none"
            :disabled="!allowZIndex"
          />
        </label>
      </div>
      <label class="flex items-center space-x-2">
        <span>attach:</span>
        <input v-model="attach" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>focusRetain:</span>
        <input v-model="focusRetain" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>focusTrap:</span>
        <input v-model="focusTrap" type="checkbox" />
      </label>
      <button class="vfm-btn" @click="reset">reset</button>
    </div>
    <h4>Attach area:</h4>
    <div id="attach" class="relative w-full h-64 mt-8 p-4 border rounded dark:bg-gray-700">
      <button class="vfm-btn" @click="openAttach">
        Attach to here and open modal
      </button>
      <p>click will:</p>
      <ul>
        <li>set "attach" to "true"</li>
        <li>set "lockScroll" to "false"</li>
      </ul>
    </div>
  </div>
</template>

<script>
const initData = () => ({
  showModal: false,
  ssr: true,
  lockScroll: true,
  hideOverlay: false,
  clickToClose: true,
  escToClose: false,
  preventClick: false,
  transition: true,
  overlayTransition: true,
  zIndexAuto: true,
  zIndexBase: 1000,
  allowZIndex: false,
  zIndex: 0,
  attach: false,
  focusRetain: true,
  focusTrap: false
})

export default {
  data: initData,
  methods: {
    openAttach() {
      this.attach = '#attach'
      this.showModal = true
      this.lockScroll = false
    },
    reset() {
      Object.assign(this, initData())
    }
  }
}
</script>
