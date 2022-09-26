<script setup lang="ts">
import { markRaw, ref } from 'vue'
import ModalsContainer from '../ModalsContainer.vue'
import DefaultSlot from '../DefaultSlot.vue'
import VBottomSheet from './VBottomSheet.vue'
import type { ModalId, VueFinalModal } from '~/index'
import { useModal, vfm } from '~/index'

const show = ref(false)
const theModalId = Symbol('theModalId')

function toggle(modalId: ModalId) {
  vfm.toggle(modalId)
}

async function useBottomSheet() {
  const modal = useModal<
    InstanceType<typeof VBottomSheet>['$props'] & InstanceType<typeof VueFinalModal>['$props'],
    InstanceType<typeof DefaultSlot>['$props']
  >({
    component: markRaw(VBottomSheet),
    attrs: {
      background: 'interactive',
      bottomSheetStyle: {
        backgroundColor: '#fff',
      },
    },
    defaultSlot: {
      component: markRaw(DefaultSlot),
      attrs: {
        text: '123',
        onCreate() {
          console.log('onCreated')
        },
      },
    },
  })

  return await modal.open()
}
</script>

<template>
  <div style="padding-top: 100px">
    <button @click="show = !show">
      open vfm
    </button>
    <button @click="() => toggle(theModalId)">
      open modal by modal modalId
    </button>
    <button @click="() => useBottomSheet()">
      create bottom sheet component
    </button>
    <VBottomSheet
      v-model="show"
      :modal-id="theModalId"
    >
      <div style="background-color: #fff; height: 500px">
        <div>Direct use vfm</div>
        <button @click="() => toggle(theModalId)">
          close modal by modal modalId
        </button>
        <button @click="show = false">
          close
        </button>
      </div>
      <!-- <div style="background-color: #fff; height: 500px">
        Direct use vfm
      </div> -->
      <!-- <div style="background-color: #fff; height: 500px">
        Direct use vfm
      </div> -->
      <!-- <div style="background-color: #fff; height: 500px">
        Direct use vfm
      </div> -->
    </VBottomSheet>
  </div>

  <div v-for="i in 1000" :key="i">
    test: {{ i }}
  </div>

  <ModalsContainer />
</template>
