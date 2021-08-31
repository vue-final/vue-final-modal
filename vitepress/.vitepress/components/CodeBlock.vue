<template>
  <div>
    <h1>Code block</h1>
    <h2>filename: {{ filename }}</h2>
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    filename: {
      type: String
    }
  }
})
</script>
