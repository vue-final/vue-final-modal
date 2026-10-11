<script setup lang="ts">
import { useTemplate } from 'vue-use-template'
import SsrNotice from '../../components/SsrNotice.vue'

const { data: product } = await useFetch('/api/ssr-product')
if (product.value?.soldOut)
  useTemplate({ component: SsrNotice, props: { text: 'Shown after an await' } }).show()
</script>

<template>
  <p>show() after an await in page setup</p>
</template>
