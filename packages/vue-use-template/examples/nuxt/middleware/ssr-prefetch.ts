export default defineNuxtRouteMiddleware(async () => {
  const product = useState<{ soldOut: boolean }>('ssr-prefetched-product')
  if (!product.value)
    product.value = await $fetch('/api/ssr-product')
})
