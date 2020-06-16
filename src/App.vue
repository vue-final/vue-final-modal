<template>
  <div id="app" class="p-4 bg-gray-800">
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
      <label class="block mb-2"
        >box scrollable: <input type="checkbox" v-model="scrollableBox"
      /></label>
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
        :box-class="[
          'w-3/4 p-4 bg-white',
          { 'max-h-1/2 overflow-auto': scrollableBox }
        ]"
        :attach="attach && '#container'"
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
        <template v-if="scrollableBox">
          <h3 class="text-2xl"># scrollable box</h3>
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

    <div v-for="i in 100" :key="i" class="text-white text-center">{{ i }}</div>
  </div>
</template>

<script>
import VueFinalModal from '@/components/VueFinalModal'
const getDefaultProps = () => ({
  lockScroll: true,
  hideOverlay: false,
  clickToClose: true,
  center: true,
  scrollableContainer: true,
  scrollableBox: true,
  scrollableContent: true,
  attach: false
})

export default {
  components: {
    VueFinalModal
  },
  data: () => ({
    ...getDefaultProps(),
    showModal: false
  }),
  methods: {
    reset() {
      Object.assign(this, getDefaultProps())
    }
  }
}
</script>
