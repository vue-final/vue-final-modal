<script setup lang="ts">
const props = defineProps<{
  content: string
}>()

const copied = ref(false)

async function copy() {
  await navigator.clipboard.writeText(props.content)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}
</script>

<template>
  <button
    type="button"
    class="group relative block w-full overflow-hidden rounded-xl border border-default bg-elevated/50 text-left font-mono"
    @click="copy"
  >
    <span class="relative flex h-12 items-center border-b border-default px-4">
      <span class="flex gap-2">
        <span class="size-3 rounded-full bg-[#ff7353]" />
        <span class="size-3 rounded-full bg-[#ffdc4e]" />
        <span class="size-3 rounded-full bg-[#3ceea5]" />
      </span>
      <span class="absolute inset-x-0 text-center text-base font-semibold text-highlighted">Bash</span>
    </span>
    <span class="block min-h-52 p-4 text-sm text-default">
      <span class="mr-2 font-bold">$</span>{{ props.content }}
    </span>
    <span class="absolute inset-0 flex items-center justify-center bg-default/60 font-sans text-sm text-highlighted opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
      {{ copied ? 'Copied!' : 'Click to copy' }}
    </span>
  </button>
</template>
