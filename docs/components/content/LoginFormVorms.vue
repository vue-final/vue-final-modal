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
  <h1 class="text-2xl mb-4">Login</h1>
  <form @submit="handleSubmit">
    <div class="field">
      <input
        v-model="account"
        class="field__input"
        type="text"
        placeholder="Account"
        v-bind="accountAttrs"
      >
      <div v-show="'account' in errors" class="field__error">
        {{ errors.account }}
      </div>
    </div>
    <div class="field">
      <input
        v-model="password"
        class="field__input"
        type="password"
        placeholder="Password"
        v-bind="passwordAttrs"
      >
    </div>

    <div class="field checkbox">
      <input
        id="remember"
        v-model="remember"
        class="field__checkbox"
        type="checkbox"
        v-bind="rememberAttrs"
      >
      <label for="remember">remember</label>
    </div>

    <div class="field">
      <input type="submit" value="Submit">
    </div>
  </form>
</template>

<style>
.field + .field {
  margin-top: 15px;
}

.field__input,
input[type='submit'] {
  box-sizing: border-box;
  width: 100%;
  border-radius: 4px;
  border: 1px solid white;
  padding: 4px 16px 4px 4px;
}

.field__error {
  color: red;
  margin-top: 2px;
}

.checkbox {
  display: flex;
  align-items: center;
}

.field__checkbox {
  accent-color: #41b883;
}

.field__checkbox + label {
  margin-left: 4px;
}

input[type='submit'] {
  background: #41b883;
  border: 1px solid #41b883;
  cursor: pointer;
}
</style>
