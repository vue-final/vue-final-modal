<template>
  <div class="pb-8">
    <custom-modal
      v-model="props.showModal"
      :display-directive="props.displayDirective"
      :lock-scroll="props.lockScroll"
      :hide-overlay="props.hideOverlay"
      :click-to-close="props.clickToClose"
      :esc-to-close="props.escToClose"
      :prevent-none="props.preventNone"
      :transition="props.transition ? 'vfm' : ''"
      :overlay-transition="props.overlayTransition ? 'vfm' : ''"
      :z-index-auto="props.zIndexAuto"
      :z-index-base="props.zIndexBase"
      :z-index="props.allowZIndex ? props.zIndex : false"
      :attach="props.attach ? props.attachTo : false"
      :focus-retain="props.focusRetain"
      :focus-trap="props.focusTrap"
      :drag="props.drag"
      :fit-parent="props.fitParent"
      :keep-changed-style="props.keepChangedStyle"
      :resize="props.resize"
      :resize-directions="props.resizeDirections"
      :drag-selector="props.allowDragSelector ? props.dragSelector : ''"
      :min-width="props.minWidth"
      :max-width="props.maxWidth"
      :min-height="props.minHeight"
      :max-height="props.maxHeight"
      @confirm="props.showModal = false"
      @cancel="props.showModal = false"
    >
      <template #title># Hello, world!</template>
      <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
    </custom-modal>

    <div class="flex my-4 space-x-2">
      <button class="btn btn--highlight" @click="props.showModal = true">Open Modal</button>
      <button class="btn" @click="reset">reset</button>
    </div>

    <h3 class="py-2">Basic:</h3>

    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 p-4 border rounded select-none">
      <label class="flex items-center space-x-2">
        <span>value:</span>
        <input v-model="props.showModal" type="checkbox" />
      </label>
      <div class="flex flex-col">
        <span>displayDirective:</span>
        <div class="flex space-x-4">
          <label class="space-x-2">
            <span>v-if:</span>
            <input type="radio" value="if" v-model="props.displayDirective" />
          </label>
          <label class="space-x-2">
            <span>v-show:</span>
            <input type="radio" value="show" v-model="props.displayDirective" />
          </label>
        </div>
      </div>
      <label class="flex items-center space-x-2">
        <span>lockScroll:</span>
        <input v-model="props.lockScroll" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>hideOverlay:</span>
        <input v-model="props.hideOverlay" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>clickToClose:</span>
        <input v-model="props.clickToClose" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>escToClose:</span>
        <input v-model="props.escToClose" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>preventNone:</span>
        <input v-model="props.preventNone" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>transition:</span>
        <input v-model="props.transition" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>overlayTransition:</span>
        <input v-model="props.overlayTransition" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>zIndexAuto:</span>
        <input v-model="props.zIndexAuto" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>zIndexBase:</span>
        <input v-model="props.zIndexBase" class="w-20 pl-2 dark:text-black rounded focus:outline-none" type="number" />
      </label>
      <div class="flex items-center space-x-2">
        <label class="flex items-center space-x-2">
          <input v-model="props.allowZIndex" type="checkbox" />
          <span>zIndex:</span>
        </label>
        <label>
          <input
            v-model="props.zIndex"
            type="number"
            class="w-20 pl-2 dark:text-black rounded focus:outline-none"
            :disabled="!props.allowZIndex"
          />
        </label>
      </div>
      <div class="flex flex-col">
        <label class="flex items-center space-x-2">
          <input v-model="props.attach" type="checkbox" />
          <span>attach:</span>
        </label>
        <label>
          <span>id=</span>
          <input v-model="props.attachTo" disabled class="pl-2 dark:text-black rounded focus:outline-none" />
        </label>
      </div>
      <label class="flex items-center space-x-2">
        <span>focusRetain:</span>
        <input v-model="props.focusRetain" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>focusTrap:</span>
        <input v-model="props.focusTrap" type="checkbox" />
      </label>
    </div>
    <h3 class="py-2">Drag & Resize:</h3>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded select-none">
      <label class="flex items-center space-x-2">
        <span>drag:</span>
        <input v-model="props.drag" type="checkbox" />
      </label>
      <div class="flex flex-col">
        <label class="flex items-center space-x-2">
          <input v-model="props.allowDragSelector" type="checkbox" />
          <span>dragSelector:</span>
        </label>
        <label>
          <input
            v-model="props.dragSelector"
            :disabled="!props.allowDragSelector"
            class="pl-2 dark:text-black rounded focus:outline-none"
          />
        </label>
      </div>
      <label class="flex items-center space-x-2">
        <span>fitParent:</span>
        <input v-model="props.fitParent" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>keepChangedStyle:</span>
        <input v-model="props.keepChangedStyle" type="checkbox" />
      </label>
      <label class="flex items-center space-x-2">
        <span>resize:</span>
        <input v-model="props.resize" type="checkbox" />
      </label>
      <div class="flex flex-col">
        <span>resizeDirections:</span>
        <div class="flex space-x-1">
          <div v-for="direction in ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl']" :key="direction">
            <label>
              {{ direction }}:
              <input v-model="props.resizeDirections" type="checkbox" :value="direction" />
            </label>
          </div>
        </div>
      </div>
      <label class="flex items-center space-x-2">
        <span>minWidth:</span>
        <input
          v-model.number="props.minWidth"
          type="number"
          class="w-20 pl-2 dark:text-black rounded focus:outline-none"
        />
      </label>
      <label class="flex items-center space-x-2">
        <span>maxWidth:</span>
        <input
          v-model.number="props.maxWidth"
          type="number"
          class="w-20 pl-2 dark:text-black rounded focus:outline-none"
        />
      </label>
      <label class="flex items-center space-x-2">
        <span>minHeight:</span>
        <input
          v-model.number="props.minHeight"
          type="number"
          class="w-20 pl-2 dark:text-black rounded focus:outline-none"
        />
      </label>
      <label class="flex items-center space-x-2">
        <span>maxHeight:</span>
        <input
          v-model.number="props.maxHeight"
          type="number"
          class="w-20 pl-2 dark:text-black rounded focus:outline-none"
        />
      </label>
    </div>
    <h3 class="py-2">Attach:</h3>
    <div id="attach" class="relative w-full h-64 p-4 border rounded dark:bg-gray-900 overflow-hidden">
      <h4 class="mb-2 text-2xl">Id: #attach</h4>
      <button class="btn btn--highlight" @click="openAttach">Attach to here and open modal</button>
      <p>click will:</p>
      <ul>
        <li>set "attach" to "true"</li>
        <li>set "lockScroll" to "false"</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const initData = () => ({
  showModal: false,
  displayDirective: 'if',
  lockScroll: true,
  hideOverlay: false,
  clickToClose: true,
  escToClose: false,
  preventNone: false,
  transition: true,
  overlayTransition: true,
  zIndexAuto: true,
  zIndexBase: 1000,
  allowZIndex: false,
  zIndex: 0,
  attach: false,
  attachTo: '#attach',
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

const props = ref(initData())

function openAttach() {
  props.value.attach = true
  props.value.showModal = true
  props.value.lockScroll = false
}

function reset() {
  props.value = initData()
}
</script>
