import { createRouter, createWebHistory } from 'vue-router'
import { pages } from '@viteplay/vue/client'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./App.vue'),
    },
    ...pages,
    {
      path: '/:all(.*)*',
      component: () => import('./404.vue'),
    },
  ],
})

let initialPageRender = true

router.beforeEach((to, from, next) => {
  if (initialPageRender && to.path === '/') {
    initialPageRender = false
    next('/dev')
    return
  }
  return next()
})
