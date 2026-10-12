---
layout: home

hero:
  name: vue-use-template
  text: Show components from anywhere
  tagline: Call useTemplate() in a component, a store or a composable, and TemplateProvider renders the component in one place, server rendering included.
  actions:
    - theme: brand
      text: Get Started
      link: /guide
    - theme: alt
      text: API
      link: /guide#api
    - theme: alt
      text: GitHub
      link: https://github.com/vue-final/vue-final-modal/tree/v5/packages/vue-use-template

features:
  - title: Show from anywhere
    details: useTemplate() works in setup, and on the client in stores and composables. show() renders the component and hide() removes it.
  - title: Props, events and slots
    details: Pass reactive props, listeners and nested templates. A shown template re-renders when the state it reads changes.
  - title: Server rendering
    details: Templates shown while components set up are part of the server HTML and hydrate without mismatches. Every request keeps its own templates.
  - title: Typed templates
    details: defineTemplate() checks props and events against the component, and createTemplateProvider() keeps a library's templates apart from the app's.
---

<script setup lang="ts">
import App from '../cypress/components/App.vue'
</script>

## Try it

This is the [usage example](/guide#usage) from the guide, running on this page.

<div class="demo">
  <App />
</div>
