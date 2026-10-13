<script setup lang="ts">
import { VueFinalDialog } from 'vue-final-modal'

const initialName = 'Hunter'
const name = ref(initialName)
const draft = ref('')
const show = ref(false)
const confirm = useConfirm()

function edit() {
  draft.value = name.value
  show.value = true
}

function save() {
  name.value = draft.value
  show.value = false
}

async function discard() {
  if (draft.value === name.value || await confirm('Discard your changes?'))
    show.value = false
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <VButton @click="edit">
      Edit Profile
    </VButton>
    <output class="inline-flex items-center gap-1.5 rounded-md border border-default px-2 py-1 text-sm text-muted">
      Name: <span class="font-medium text-highlighted">{{ name }}</span>
    </output>
    <button type="button" class="rounded-md border border-default px-2 py-1 text-sm text-muted hover:bg-elevated/50 hover:text-highlighted disabled:pointer-events-none disabled:opacity-50" :disabled="name === initialName" @click="name = initialName">
      Reset
    </button>
  </div>

  <VueFinalDialog
    v-model="show"
    aria-labelledby="modal-in-dialog-title"
    class="m-auto w-[calc(100%-2rem)] max-w-md p-4 rounded-lg border bg-white text-gray-900 dark:bg-gray-900 dark:text-white dark:border-gray-700 backdrop:bg-black/50"
  >
    <div class="flex flex-col gap-2">
      <h2 id="modal-in-dialog-title" class="text-xl">
        Edit profile
      </h2>
      <input v-model="draft" aria-label="Name" class="px-2 py-1 border rounded-lg bg-transparent">
      <div class="flex justify-end gap-2">
        <button type="button" class="px-2 border rounded-lg" @click="discard">
          Discard
        </button>
        <button type="button" class="px-2 border rounded-lg" @click="save">
          Save
        </button>
      </div>
    </div>
  </VueFinalDialog>
</template>
