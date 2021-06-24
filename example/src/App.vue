<template>
  <div id="app" class="p-4">
    <h2 class="text-3xl py-2">Options:</h2>
    <basic-options />

    <h2 class="text-3xl py-2">v-basic:</h2>
    <v-basic></v-basic>
    <h2 class="text-3xl py-2">v-background:</h2>
    <v-background></v-background>
    <h2 class="text-3xl py-2">v-centered:</h2>
    <v-centered></v-centered>
    <h2 class="text-3xl py-2">v-content:</h2>
    <v-content></v-content>
    <h2 class="text-3xl py-2">v-close:</h2>
    <v-close-button></v-close-button>
    <h2 class="text-3xl py-2">v-scrollable:</h2>
    <v-scrollable></v-scrollable>
    <h2 class="text-3xl py-2">v-action:</h2>
    <v-action-buttons></v-action-buttons>
    <h2 class="text-3xl py-2">v-stackable:</h2>
    <v-stackable></v-stackable>
    <h2 class="text-3xl py-2">Pass Params:</h2>
    <v-params></v-params>
    <h2 class="text-3xl py-2">Stop before close:</h2>
    <v-stop-before-close></v-stop-before-close>
    <h2 class="text-3xl py-2">Stop before open:</h2>
    <v-stop-before-open></v-stop-before-open>
    <h2 class="text-3xl py-2">Dynamic modal</h2>
    <v-dynamic></v-dynamic>
    <h2 class="text-3xl py-2">Advanced dynamic modal</h2>
    <v-dynamic-advanced></v-dynamic-advanced>
    <h2 class="text-3xl py-2">Tailwind HOC Custom Transition Modal</h2>
    <hoc-example-tailwind-custom-transition></hoc-example-tailwind-custom-transition>

    <modals-container></modals-container>

    <div v-for="i in 100" :key="i">{{ i }}</div>
  </div>
</template>
