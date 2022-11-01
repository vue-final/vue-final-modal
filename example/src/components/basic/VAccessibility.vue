<template>
  <div>
    <custom-modal v-model="show" focus-trap @confirm="show = false" @cancel="show = false">
      <template #title>Hello, vue-final-modal</template>
      <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
    </custom-modal>

    <v-button highlight @click="show = true">Open modal</v-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false
  })
}
</script>
