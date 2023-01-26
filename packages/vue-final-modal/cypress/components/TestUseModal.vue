<script lang="ts" setup>
import { ModalsContainer } from '~/index'

const props = defineProps<{
  run: () => void
}>()

props.run()
</script>

<template>
  <ModalsContainer />
</template>
