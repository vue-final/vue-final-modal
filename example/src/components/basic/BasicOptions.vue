<template>
  <div class="pb-8">
    <custom-modal
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
      :drag="drag"
      :fit-parent="fitParent"
      :keep-changed-style="keepChangedStyle"
      :resize="resize"
      :resize-directions="resizeDirections"
      :drag-selector="allowDragSelector ? dragSelector : ''"
      :min-width="minWidth"
      :max-width="maxWidth"
      :min-height="minHeight"
      :max-height="maxHeight"
      @confirm="showModal = false"
      @cancel="showModal = false"
    >
      <template v-slot:title># Hello, world!</template>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </custom-modal>

    <div class="flex space-x-2">
      <v-button highlight @click="showModal = true">Open Modal</v-button>
      <v-button @click="reset">reset</v-button>
    </div>

    <h3 class="py-2">Basic:</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 p-4 border rounded select-none">
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
    </div>
    <h3 class="py-2">Drag & Resize:</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded select-none">
      <label class="flex items-center space-x-2">
        <span>drag:</span>
        <input v-model="drag" type="checkbox" />
      </label>
      <div class="flex flex-col">
        <label class="flex items-center space-x-2">
          <input v-model="allowDragSelector" type="checkbox" />
          <span>dragSelector:</span>
        </label>
        <label>
          <input
            v-model="dragSelector"
            :disabled="!allowDragSelector"
            class="pl-2 dark:text-black rounded focus:outline-none"
          />
        </label>
      </div>
      <label class="flex items-center space-x-2">
        <span>fitParent:</span>
        <input v-model="fitParent" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>keepChangedStyle:</span>
        <input v-model="keepChangedStyle" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>resize:</span>
        <input v-model="resize" type="checkbox" />
      </label>
      <div class="flex flex-col">
        <span>resizeDirections:</span>
        <div class="flex space-x-1">
          <div v-for="direction in ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']" :key="direction">
            <label>
              {{ direction }}:
              <input type="checkbox" v-model="resizeDirections" :value="direction" />
            </label>
          </div>
        </div>
      </div>
      <label class="flex items-center space-x-2">
        <span>minWidth:</span>
        <input v-model.number="minWidth" type="number" class="w-20 pl-2 dark:text-black rounded focus:outline-none" />
      </label>
      <label class="flex items-center space-x-2">
        <span>maxWidth:</span>
        <input v-model.number="maxWidth" type="number" class="w-20 pl-2 dark:text-black rounded focus:outline-none" />
      </label>
      <label class="flex items-center space-x-2">
        <span>minHeight:</span>
        <input v-model.number="minHeight" type="number" class="w-20 pl-2 dark:text-black rounded focus:outline-none" />
      </label>
      <label class="flex items-center space-x-2">
        <span>maxHeight:</span>
        <input v-model.number="maxHeight" type="number" class="w-20 pl-2 dark:text-black rounded focus:outline-none" />
      </label>
    </div>
    <h3 class="py-2">Attach:</h3>
    <div id="attach" class="relative w-full h-64 p-4 border rounded dark:bg-gray-900 overflow-hidden">
      <v-button highlight @click="openAttach">Attach to here and open modal</v-button>
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
  focusTrap: false,
  drag: false,
  fitParent: true,
  keepChangedStyle: false,
  resize: false,
  resizeDirections: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'],
  allowDragSelector: false,
  dragSelector: '.modal__title',
  minWidth: 0,
  maxWidth: 2000,
  minHeight: 0,
  maxHeight: 2000
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
