<script setup lang="ts">
export type FormData = {
  account: string
  password: string
}

// eslint-disable-next-line vue/define-macros-order
const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const account = ref('')
const password = ref('')
</script>

<template>
  <h1 class="mb-4 text-2xl">
    Login
  </h1>
  <form @submit.prevent="emit('submit', { account, password })">
    <label>
      <span>Account:</span>
      <input v-model="account" type="text" placeholder="Account">
    </label>
    <label>
      <span>Password:</span>
      <input v-model="password" type="password" placeholder="Password">
    </label>
    <input type="submit" value="Submit">
  </form>
</template>

<style scoped>
form {
  @apply flex flex-col space-y-4;
}

label {
  @apply flex items-center justify-between w-full space-x-4;
}

input[type='submit'] {
  @apply bg-primary-500 hover:bg-primary-600 focus:ring-primary-600 rounded-lg border border-transparent px-3 py-1.5 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 cursor-pointer;
}
</style>
