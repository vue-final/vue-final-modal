<script setup lang="ts">
import { markRaw, ref } from 'vue'
import { ModalsContainer, VBottomSheet, useModal, useVfm } from 'vue-final-modal'
import DefaultSlot from '../DefaultSlot.vue'

const show = ref(false)
const theModalId = Symbol('theModalId')

const { toggle } = useVfm()

const bottomSheet = useModal<
  InstanceType<typeof VBottomSheet>['$props'],
  InstanceType<typeof DefaultSlot>['$props']
>({
  component: markRaw(VBottomSheet),
  attrs: {
    background: 'interactive',
    bottomSheetStyle: {
      backgroundColor: '#fff',
    },
  },
  slots: {
    default: {
      component: markRaw(DefaultSlot),
      attrs: {
        text: '123',
        onCreate() {
          // console.log('onCreated')
        },
      },
    },
  },
})

function beforeOpen(e: any) {
  console.log('beforeOpen', e)
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
    <button @click="() => bottomSheet.open()">
      create bottom sheet component
    </button>
    <VBottomSheet
      v-model="show"
      :modal-id="theModalId"
      @before-open="beforeOpen"
    >
      <div style="background-color: #fff; height: 500px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
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
