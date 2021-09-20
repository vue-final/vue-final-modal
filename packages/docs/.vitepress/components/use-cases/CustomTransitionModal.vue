<template>
  <div>
    <v-windi-modal v-model="show" @confirm="confirm" @cancel="cancel">
      <template #title>Hello, vue-final-modal</template>
      <p>Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.</p>
    </v-windi-modal>

    <v-button highlight @click="show = true">Open modal</v-button>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false
  }),
  methods: {
    confirm() {
      // some code...
      this.show = false
    },
    cancel(close) {
      // some code...
      close()
    }
  }
}
</script>
