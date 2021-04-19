<template>
  <div>
    <v-tailwind-modal v-model="show" @confirm="confirm" @cancel="cancel">
      <template v-slot:title>Hello, vue-final-modal</template>
      <p>
        Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
      </p>
    </v-tailwind-modal>

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
