<script setup lang="ts">
import { isScrollLocked, lockScroll, unlockScroll } from "../../src";
import { onMounted, ref, useTemplateRef } from "vue";

const lockTargetEl = useTemplateRef<HTMLElement>("lockTargetEl");
const count = ref(0);

function lock() {
  const state = lockScroll(lockTargetEl.value);
  count.value = state?.count ?? 0;
}

function unlock() {
  const state = unlockScroll(lockTargetEl.value);
  count.value = state?.count ?? 0;
}

function unlockForce() {
  const state = unlockScroll(lockTargetEl.value, { force: true });
  count.value = state?.count ?? 0;
}

onMounted(() => {
  setInterval(() => {
    count.value = isScrollLocked(lockTargetEl.value) ? count.value : 0;
  }, 100);
});
</script>

<template>
  <div class="space-y-2">
    <div>
      IsLocked:
      <span
        :class="{
          'text-orange-400 dark:text-orange-300': !(count > 0),
          'text-emerald-600 dark:text-emerald-400': count > 0,
        }"
        >{{ count > 0 }}</span
      >
    </div>
    <div>
      Current Lock Count:
      <span
        :class="{
          'text-orange-400 dark:text-orange-300': !(count > 0),
          'text-emerald-600 dark:text-emerald-400': count > 0,
        }"
        >{{ count }}</span
      >
    </div>
    <div class="flex flex-wrap items-center gap-2">
      <button type="button" class="button w-[100px]" @click="lock">Lock</button>
      <button type="button" class="button w-[100px]" @click="unlock">
        Unlock
      </button>

      <button type="button" class="button w-[120px]" @click="unlockForce">
        Force Unlock
      </button>
    </div>
    <div>
      <div ref="lockTargetEl" class="block scroll-block">
        <div class="block scroll-block-sticky">I'm sticky</div>
        <p v-for="i in 40" :key="i">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aliquid
          aspernatur blanditiis consectetur dolorem earum eligendi, hic illum
          impedit ipsam labore molestiae odit quas quia rem repellat sed sint
          voluptate!
        </p>
      </div>
    </div>
  </div>
</template>
