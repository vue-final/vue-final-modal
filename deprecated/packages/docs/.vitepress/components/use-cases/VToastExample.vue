<template>
  <button class="btn btn--highlight" @click="$toast.show({ message, timeout })">Open toast</button>

  <label class="ml-4">
    Message:
    <input type="text" v-model="message" class="pl-2 dark:text-black rounded focus:outline-none" />
  </label>
  <label class="ml-4">
    Timeout:
    <input type="number" v-model="timeout" class="pl-2 dark:text-black rounded focus:outline-none" />
  </label>
</template>

<script setup>
import { ref } from 'vue'
import { $toast } from '@/components/use-cases/toast.js'

const message = ref('Hi, VFM!!')
const timeout = ref(3000)
</script>
