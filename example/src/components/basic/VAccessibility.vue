<template>
  <div>
    <v-modal
      v-model="show"
      @confirm="show = false"
      @cancel="show = false"
      focus-trap
    >
      <template v-slot:title>Hello, vue-final-modal</template>
      <p>
        Vue Final Modal is a renderless, stackable, detachable and lightweight
        modal component.
      </p>
    </v-modal>

    <button class="vfm-btn" @click="show = true">Open modal</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    show: false
  })
}
</script>
