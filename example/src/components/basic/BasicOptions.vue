<template>
  <div class="pb-8">
    <vue-final-modal
      v-model="showModal"
      classes="flex justify-center items-center"
      content-class="relative max-h-1/2 p-4 bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg overflow-auto"
      v-bind="props"
    >
      <span class="text-2xl mb-2"># Hello, world!</span>
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>
      <button
        class="absolute top-0 right-0 mt-2 mr-4 text-3xl hover:text-gray-700 leading-none focus:outline-none"
        @click="showModal = false"
      >
        x
      </button>
    </vue-final-modal>

    <base-button @click="showModal = true">Open Basic Modal</base-button>

    <h4>Prop Options:</h4>

    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded"
    >
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
        <span>zIndexBase:</span>
        <input
          v-model="zIndexBase"
          class="w-20 pl-2 dark:text-black rounded focus:outline-none"
          type="number"
        />
      </label>
      <div class="flex items-center space-x-2">
        <label class="flex items-center space-x-2">
          <input v-model="allowZIndex" type="checkbox" />
          <span>zIndex:</span>
        </label>
        <input
          v-model="zIndex"
          type="number"
          class="w-20 pl-2 dark:text-black rounded focus:outline-none"
          :disabled="!allowZIndex"
        />
      </div>
      <label class="flex items-center space-x-2">
        <span>attach:</span>
        <input v-model="attach" type="checkbox" />
      </label>
    </div>
    <h4>Attach area:</h4>
    <div
      id="attach"
      class="relative w-full h-64 mt-8 p-4 border rounded dark:bg-gray-700"
    >
      <base-button @click="openAttach"
        >Attach to here and open modal</base-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    showModal: false,
    ssr: true,
    lockScroll: true,
    hideOverlay: false,
    clickToClose: true,
    preventClick: false,
    transition: true,
    overlayTransition: true,
    zIndexBase: 1000,
    allowZIndex: false,
    zIndex: 0,
    attach: false
  }),
  computed: {
    props() {
      return {
        ssr: this.ssr,
        lockScroll: this.lockScroll,
        hideOverlay: this.hideOverlay,
        clickToClose: this.clickToClose,
        preventClick: this.preventClick,
        transition: this.transition ? 'vfm' : '',
        overlayTransition: this.overlayTransition ? 'vfm' : '',
        zIndexBase: this.zIndexBase,
        ...(this.allowZIndex && { zIndex: this.zIndex }),
        attach: this.attach ? '#attach' : false
      }
    }
  },
  methods: {
    openAttach() {
      this.attach = '#attach'
      this.showModal = true
    }
  }
}
</script>
