<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'submit', payload: {
    account: string
    password: string
  }): void
}>()

const account = ref('')
const password = ref('')
</script>

<template>
  <form @submit.prevent="() => emit('submit', { account, password })">
    <label>Account:<input v-model="account" class="form-account" type="text"></label>
    <label>Password:<input v-model="password" class="form-password" type="password"></label>

    <button class="form-submit" type="submit">
      Submit
    </button>
  </form>
</template>
