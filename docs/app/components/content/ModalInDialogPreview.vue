<script setup lang="ts">
import { VueFinalDialog } from 'vue-final-modal'

const show = ref(false)
const name = ref('Hunter')
const confirm = useConfirm()

async function discard() {
  if (await confirm('Discard your changes?'))
    show.value = false
}
</script>

<template>
  <VButton @click="show = true">
    Edit Profile
  </VButton>

  <VueFinalDialog
    v-model="show"
    aria-labelledby="modal-in-dialog-title"
    class="m-auto w-[calc(100%-2rem)] max-w-md p-4 rounded-lg border bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700 backdrop:bg-black/50"
  >
    <div class="flex flex-col gap-2">
      <h2 id="modal-in-dialog-title" class="text-xl">
        Edit profile
      </h2>
      <input v-model="name" aria-label="Name" class="px-2 py-1 border rounded-lg bg-transparent">
      <div class="flex justify-end gap-2">
        <button type="button" class="px-2 border rounded-lg" @click="discard">
          Discard
        </button>
        <button type="button" class="px-2 border rounded-lg" @click="show = false">
          Save
        </button>
      </div>
    </div>
  </VueFinalDialog>
</template>
