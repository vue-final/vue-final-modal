<template>
  <vue-final-modal
    v-slot="{ params, close }"
    v-bind="$attrs"
    classes="flex justify-center items-center"
    content-class="relative flex flex-col max-h-full mx-4 p-4 border dark:border-gray-800 rounded bg-white dark:bg-gray-900"
    v-on="$listeners"
  >
    <span class="mr-8 text-2xl font-bold ">
      <slot name="title"></slot>
    </span>
    <div class="flex-grow overflow-y-auto">
      <slot v-bind:params="params"></slot>
    </div>
    <div class="flex-shrink-0 flex justify-center items-center pt-4">
      <v-button @click="$emit('confirm', close)">confirm</v-button>
      <v-button @click="$emit('cancel', close)">cancel</v-button>
    </div>
    <button class="absolute top-0 right-0 mt-2 mr-2" @click="close">
      <mdi-close></mdi-close>
    </button>
  </vue-final-modal>
</template>

<script>
export default {
  name: 'VTailwindModal',
  inheritAttrs: false
}
</script>
