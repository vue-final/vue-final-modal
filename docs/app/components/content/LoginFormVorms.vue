<script setup lang="ts">
import { useForm } from '@vorms/core'

export type FormData = {
  account: string
  password: string
  remember: boolean
}

const emit = defineEmits<{
  (e: 'submit', formData: FormData): void
}>()

const { register, errors, handleSubmit } = useForm({
  initialValues: {
    account: '',
    password: '',
    remember: false,
  },
  onSubmit(values) {
    emit('submit', values)
  },
})

const { value: account, attrs: accountAttrs } = register('account', {
  validate(value) {
    if (!value)
      return 'account is required!'
  },
})
const { value: password, attrs: passwordAttrs } = register('password')
const { value: remember, attrs: rememberAttrs } = register('remember')
</script>

<template>
  <form class="flex flex-col gap-4" @submit="handleSubmit">
    <div>
      <input
        v-model="account"
        class="w-full px-2 py-1 border dark:border-gray-700 rounded-lg bg-transparent"
        type="text"
        placeholder="Account"
        v-bind="accountAttrs"
      >
      <div v-show="'account' in errors" class="mt-0.5 text-red-500">
        {{ errors.account }}
      </div>
    </div>
    <input
      v-model="password"
      class="w-full px-2 py-1 border dark:border-gray-700 rounded-lg bg-transparent"
      type="password"
      placeholder="Password"
      v-bind="passwordAttrs"
    >
    <div class="flex items-center gap-1">
      <input
        id="remember"
        v-model="remember"
        class="accent-[#41b883]"
        type="checkbox"
        v-bind="rememberAttrs"
      >
      <label for="remember">remember</label>
    </div>
    <input type="submit" value="Submit" class="w-full px-2 py-1 rounded-lg border border-[#41b883] bg-[#41b883] text-white cursor-pointer">
  </form>
</template>
