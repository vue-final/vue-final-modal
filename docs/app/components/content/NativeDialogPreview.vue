<script setup lang="ts">
import { VueFinalDialog } from 'vue-final-modal'

const show = ref(false)
const answer = ref('none yet')

function onClose(event: Event) {
  const dialog = event.target as HTMLDialogElement
  answer.value = dialog.returnValue || 'dismissed'
  /** The browser keeps the last returnValue, and Esc or a click outside leave it as it was. */
  dialog.returnValue = ''
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <VButton @click="show = true">
      Open Dialog
    </VButton>
    <output class="inline-flex items-center gap-1.5 rounded-md border border-default px-2 py-1 text-sm text-muted">
      Answer: <span class="font-medium text-highlighted">{{ answer }}</span>
    </output>
  </div>

  <VueFinalDialog
    v-model="show"
    closedby="any"
    aria-labelledby="native-dialog-title"
    class="m-auto w-[calc(100%-2rem)] max-w-md p-4 rounded-lg border bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700 opacity-0 open:opacity-100 starting:open:opacity-0 [transition:opacity_.3s,overlay_.3s_allow-discrete,display_.3s_allow-discrete] backdrop:bg-black/50 backdrop:opacity-0 open:backdrop:opacity-100 starting:open:backdrop:opacity-0 backdrop:[transition:opacity_.3s,overlay_.3s_allow-discrete,display_.3s_allow-discrete]"
    @close="onClose"
  >
    <form method="dialog" class="flex flex-col gap-2">
      <h2 id="native-dialog-title" class="text-xl">
        Subscribe to the newsletter?
      </h2>
      <p>Press Esc or click outside to dismiss it.</p>
      <div class="flex justify-end gap-2">
        <button value="no" class="px-2 border rounded-lg">
          No
        </button>
        <button value="yes" class="px-2 border rounded-lg" autofocus>
          Yes
        </button>
      </div>
    </form>
  </VueFinalDialog>
</template>
