<template>
  <div>
    <v-tailwind-modal
      v-model="show"
      @confirm="confirm"
      @cancel="cancel"
      :transition="{
        'enter-active-class': 'transition duration-200 ease-in-out transform',
        'enter-class': 'translate-y-full',
        'enter-to-class': 'translate-y-0',
        'leave-active-class': 'transition duration-200 ease-in-out transform',
        'leave-to-class': 'translate-y-full',
        'leave-class': 'translate-y-0'
      }"
    >
      <template #title>Hello, vue-final-modal</template>
      <p>
        Vue Final Modal is a renderless, stackable, detachable and lightweight modal component.
      </p>
    </v-tailwind-modal>

    <button class="vfm-btn" @click="show = true">Open modal</button>
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
