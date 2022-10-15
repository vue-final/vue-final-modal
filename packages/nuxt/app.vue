<script lang="ts" setup>
import { markRaw, onMounted, ref } from 'vue'
import {
  ModalsContainer, VBottomSheet, VFullScreen, VueFinalModal, useModal,
} from 'vue-final-modal'

const modal = useModal<InstanceType<typeof VBottomSheet>['$props']>({
  component: markRaw(VBottomSheet),
  attrs: {
    bottomSheetStyle: {
      height: '500px',
      backgroundColor: '#fff',
    },
    closeDirection: 'DOWN',
  },
  slots: { default: '123' },
})

onMounted(() => {
  modal.open()
})

const show = ref(false)
const show2 = ref(false)
function beforeClose() {
  console.log('123')
}
</script>

<template>
  <div class="p-4 space-x-4">
    <button class="px-2 border border-dark-50 rounded" @click="show = !show">
      open VueFinalModal
    </button>
    <VueFinalModal v-model="show" class="flex justify-center items-center" content-class="p-4 bg-white rounded space-y-2" @before-close="(e) => beforeClose(e)">
      <h1 class="text-lg">
        A SSR Full Screen Modal
      </h1>
      <p>with some paragraphs</p>
      <button class="block ml-auto px-2 border border-dark-50 rounded" @click="show = false">
        Close
      </button>
    </VueFinalModal>

    <button class="px-2 border border-dark-50 rounded" @click="show2 = !show2">
      open FullScreen Modal
    </button>

    <VFullScreen v-model="show2" full-screen-class="p-4 bg-white space-y-2">
      <h1 class="text-lg">
        A SSR Full Screen Modal
      </h1>
      <p>with some paragraphs</p>
      <button class="py-1 px-2 border border-dark-50 rounded" @click="show2 = false">
        Close
      </button>
    </VFullScreen>
    <ModalsContainer />
  </div>
</template>
