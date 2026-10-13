<script setup lang="ts">
const confirm = useConfirm()
const result = ref('not asked yet')

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
  </div>
</template>
