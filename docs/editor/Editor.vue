<script setup lang="ts">
import Monaco from './Monaco.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: 'mdc',
  },
  readOnly: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue'])

const raw = ref(props.modelValue)

function update(content) {
  emit('update:modelValue', content)
}
</script>

<template>
  <Monaco :value="readOnly ? modelValue : raw" :language="language" :read-only="readOnly" @change="update" />
</template>
