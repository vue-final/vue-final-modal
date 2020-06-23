<template>
  <div>
    <div class="flex flex-col items-center p-4 rounded bg-gray-100">
      <label class="block mb-2"
        >lockScroll: <input type="checkbox" v-model="lockScroll"
      /></label>
      <label class="block mb-2"
        >hideOverlay: <input type="checkbox" v-model="hideOverlay"
      /></label>
      <label class="block mb-2"
        >clickToClose: <input type="checkbox" v-model="clickToClose"
      /></label>
      <label class="block mb-2"
        >center: <input type="checkbox" v-model="center"
      /></label>
      <label class="block mb-2">
        container scrollable:
        <input type="checkbox" v-model="scrollableContainer" />
      </label>
      <label class="block mb-2">
        content scrollable:
        <input type="checkbox" v-model="scrollableContent" />
      </label>
      <label class="block mb-2">
        attach to container:
        <input type="checkbox" v-model="attach" />
      </label>
      <div>
        <base-button class="mr-2" @click="showModal = true">open</base-button>
        <base-button @click="reset">reset</base-button>
      </div>
      <vue-final-modal
        v-model="showModal"
        :lock-scroll="lockScroll"
        :hide-overlay="hideOverlay"
        :click-to-close="clickToClose"
        :class="[
          {
            'flex justify-center items-center': center,
            'overflow-auto': scrollableContainer
          }
        ]"
        :content-class="['w-3/4 p-4 bg-white', 'max-h-1/2 overflow-auto']"
        :attach="attach ? '#container' : 'body'"
      >
        <base-button @click="showModal = false">close</base-button>
        <div v-if="scrollableContent" class="my-4">
          <h3 class="text-2xl"># scrollable content</h3>
          <div
            class="h-64 border border-black rounded"
            :class="{ 'overflow-auto': scrollableContent }"
          >
            <base-lorem />
          </div>
        </div>
        <template v-if="scrollableContent">
          <h3 class="text-2xl"># scrollable content</h3>
          <base-lorem />
        </template>
        <template v-if="scrollableContainer">
          <h3 class="text-2xl"># scrollable container</h3>
          <base-lorem />
          <base-lorem />
        </template>
      </vue-final-modal>
    </div>

    <div
      id="container"
      class="relative w-full h-64 bg-red-300 m-4 p-4 border border-black"
    >
      <h1>attach to this container</h1>
    </div>

    <base-button @click="showModal2 = true">open modal2</base-button>
    <vue-final-modal
      v-model="showModal2"
      class="flex justify-center items-center"
      content-class="w-1/2 p-4 bg-white"
      :click-to-close="true"
      prevent-click
    >
      <base-button @click="showModal2 = false">close</base-button>
    </vue-final-modal>
  </div>
</template>

<script>
const getDefaultProps = () => ({
  lockScroll: true,
  hideOverlay: false,
  clickToClose: true,
  center: true,
  scrollableContainer: true,
  scrollableContent: true,
  attach: false
})

export default {
  data: () => ({
    ...getDefaultProps(),
    showModal: false,
    showModal2: false
  }),
  methods: {
    reset() {
      Object.assign(this, getDefaultProps())
    }
  }
}
</script>
