<script setup lang="ts">
import { useTemplate } from 'vue-use-template'
import SsrNotice from '../../components/SsrNotice.vue'

definePageMeta({ middleware: 'ssr-prefetch' })

const product = useState<{ soldOut: boolean }>('ssr-prefetched-product')
if (product.value?.soldOut)
  useTemplate({ component: SsrNotice, props: { text: 'Shown with prefetched data' } }).show()
</script>

<template>
  <p>show() in page setup, with data prefetched in route middleware</p>
</template>
