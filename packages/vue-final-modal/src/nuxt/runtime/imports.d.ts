/** Nuxt aliases `#imports` in every app; the package itself only needs the types. */
declare module '#imports' {
  export { defineNuxtPlugin } from 'nuxt/app'
}
