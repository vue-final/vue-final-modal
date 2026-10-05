import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@vue-final-modal/nuxt'],
  css: ['~/assets/main.css'],
  vite: {
    plugins: [tailwindcss()],
  },
})
