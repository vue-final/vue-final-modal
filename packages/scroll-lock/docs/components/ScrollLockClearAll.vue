<script setup lang="ts">
import { onMounted, ref } from "vue";
import { lockedElementSet, clearAllScrollLocks } from "../../src";

const lockedElements = ref<(HTMLElement | SVGElement)[]>(
  Array.from(lockedElementSet),
);
onMounted(() => {
  setInterval(() => {
    lockedElements.value = Array.from(lockedElementSet);
  }, 100);
});
</script>

<template>
  <div class="space-y-2">
    <div class="space-x-2">
      <span>Locked Elements:</span>
      <span
        v-if="lockedElements.length === 0"
        class="text-orange-400 dark:text-orange-300"
        >None</span
      >
      <span v-for="(el, index) in lockedElements" :key="index">
        {{ index + 1 }}:
        <span class="text-emerald-600 dark:text-emerald-400">{{
          el.tagName
        }}</span>
      </span>
    </div>
    <button
      type="button"
      class="button w-[150px]"
      @click="() => clearAllScrollLocks()"
    >
      Clear All
    </button>
  </div>
</template>
