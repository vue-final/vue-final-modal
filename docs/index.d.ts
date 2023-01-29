import { Vfm } from "vue-final-modal"

declare module '#app' {
  interface NuxtApp {
    $vfm: Vfm
  }
}

export { }