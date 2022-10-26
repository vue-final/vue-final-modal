import { Vfm } from "vue-final-modal"

declare module '#app' {
  interface NuxtApp {
    $vfm: Vfm
  }
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $vfm: Vfm
  }
}
export { }