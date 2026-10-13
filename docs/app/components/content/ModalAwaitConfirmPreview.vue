<script setup lang="ts">
const confirm = useConfirm()
const result = ref('')

async function deleteItem() {
  result.value = await confirm('Delete this item?') ? 'Deleted' : 'Kept'
}
</script>

<template>
  <VButton @click="deleteItem">
    Delete Item
  </VButton>
  <p v-if="result">
    {{ result }}
  </p>
</template>
