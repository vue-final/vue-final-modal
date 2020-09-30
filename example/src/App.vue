<template>
  <div id="app" class="p-4">
    <BasicOptions />

    <p class="text-xl py-2">v-basic:</p>
    <v-basic></v-basic>
    <p class="text-xl py-2">v-background:</p>
    <v-background></v-background>
    <p class="text-xl py-2">v-centered:</p>
    <v-centered></v-centered>
    <p class="text-xl py-2">v-content:</p>
    <v-content></v-content>
    <p class="text-xl py-2">v-close:</p>
    <v-close-button></v-close-button>
    <p class="text-xl py-2">v-scrollable:</p>
    <v-scrollable></v-scrollable>
    <p class="text-xl py-2">v-action:</p>
    <v-action-buttons></v-action-buttons>
    <p class="text-xl py-2">v-stackable:</p>
    <v-stackable></v-stackable>

    <div v-for="i in 100" :key="i">{{ i }}</div>
  </div>
</template>
