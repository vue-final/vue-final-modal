<template>
  <main class="p-8 space-y-4">
    <h1 class="text-xl font-bold">
      Where show() is called during SSR
    </h1>
    <ul class="list-disc pl-6">
      <li><a href="/ssr/setup">In page setup</a></li>
      <li><a href="/ssr/after-await">After an await in page setup</a></li>
      <li><a href="/ssr/prefetched">In page setup, with data prefetched in route middleware</a></li>
      <li><a href="/ssr/middleware">In route middleware</a></li>
      <li><a href="/ssr/plugin">In a plugin</a></li>
      <li><a href="/ssr/lazy">In a lazy component</a></li>
    </ul>
  </main>
</template>
