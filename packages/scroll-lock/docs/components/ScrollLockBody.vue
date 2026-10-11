<script setup lang="ts">
import { lockScroll, unlockScroll, isScrollLocked } from "../../src";
import { onMounted, ref } from "vue";

const isLocked = ref(false);

const onClick = () => {
  if (isLocked.value) {
    unlockScroll(document.body);
  } else {
    lockScroll(document.body);
  }
  isLocked.value = isScrollLocked(document.body);
};

onMounted(() => {
  setInterval(() => {
    isLocked.value = isScrollLocked(document.body);
  }, 100);
});
</script>

<template>
  <div class="space-y-2">
    <div>
      IsLocked:
      <span
        :class="{
          'text-orange-400 dark:text-orange-300': !isLocked,
          'text-emerald-600 dark:text-emerald-400': isLocked,
        }"
        >{{ isLocked }}</span
      >
    </div>
    <div>
      Target:
      <span class="text-emerald-600 dark:text-emerald-400">&lt;Body&gt;</span>
    </div>
    <button type="button" class="button w-[150px]" @click="onClick">
      {{ isLocked ? "Unlock" : "Lock" }}
    </button>
  </div>
  <dialog
    v-if="isLocked"
    open
    class="fixed top-2/5 inset-4 m-auto lg:max-w-1/2 mt-4 p-4 z-10 border border-gray-300 dark:border-gray-600 rounded-md space-y-2"
  >
    <div>
      You should not be able to scroll the body when this dialog is open.
    </div>
    <button type="button" class="button float-end" @click="onClick">
      {{ isLocked ? "Unlock" : "Lock" }}
    </button>
  </dialog>
</template>
