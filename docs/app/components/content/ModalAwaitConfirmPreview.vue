<script setup lang="ts">
const initialResult = 'not asked yet'
const confirm = useConfirm()
const result = ref(initialResult)

async function deleteItem() {
  result.value = await confirm('Delete this item?') ? 'Deleted' : 'Kept'
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <VButton @click="deleteItem">
      Delete Item
    </VButton>
    <output class="inline-flex items-center gap-1.5 rounded-md border border-default px-2 py-1 text-sm text-muted">
      Result: <span class="font-medium text-highlighted">{{ result }}</span>
    </output>
    <button type="button" class="rounded-md border border-default px-2 py-1 text-sm text-muted hover:bg-elevated/50 hover:text-highlighted disabled:pointer-events-none disabled:opacity-50" :disabled="result === initialResult" @click="result = initialResult">
      Reset
    </button>
  </div>
</template>
