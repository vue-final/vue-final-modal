<script setup lang="ts">
const props = defineProps({
  href: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'medium',
  },
  bold: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: '',
  },
  transparent: {
    type: Boolean,
    default: false,
  },
  blank: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const sizeClass = computed(() => {
  if (props.transparent)
    return 'bg-transparent px-0 py-0'
  switch (props.size) {
    case 'small': return 'px-3 py-1.5 text-sm leading-4'
    case 'large': return 'px-6 py-2.5 text-lg leading-6'
    default: return 'px-4 py-2 text-base leading-4'
  }
})
</script>

<template>
  <button
    class="bg-primary-500 hover:bg-primary-600 focus:ring-primary-600 mb-2 inline-flex flex-none items-center rounded-lg border border-transparent text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900"
    :class="[sizeClass, bold ? 'font-semibold' : 'font-medium']"
  >
    <UIcon v-if="icon" :name="icon" class="w-4 h-4 mr-2" />
    <slot />
  </button>
</template>
