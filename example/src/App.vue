<template>
  <div id="app" class="p-4">
    <BasicOptions />

    <TailwindBasic />
    <TailwindLockScroll class="pt-4" />
    <TailwindHideOverlay class="pt-4" />
    <TailwindClickToClose class="pt-4" />
    <TailwindPreventClick class="pt-4" />
    <TailwindStackable class="pt-4" />
    <TailwindScrollable class="pt-4" />
    <TailwindAttach class="pt-4" />

    <div v-for="i in 100" :key="i">{{ i }}</div>
  </div>
</template>
