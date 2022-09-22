import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import libInjectCss from './scripts/libInjectCss'

const name = 'index'

export default defineConfig({
  plugins: [
    vue(),
    libInjectCss(),
  ],
  publicDir: false,
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name,
      fileName: format => `${name}.${format}.js`,
    },
    rollupOptions: {
      external: [
        'vue',
        '@vueuse/core',
        '@vueuse/integrations/useFocusTrap',
        'focus-trap',
      ],
      output: {
        globals: {
          'vue': 'Vue',
          '@vueuse/core': 'VueUse',
          '@vueuse/integrations/useFocusTrap': 'VueUseFocusTrap',
          'focus-trap': 'FocusTrap',
        },
      },
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'happy-dom',
    deps: {
      inline: [
        '@vue',
        '@vueuse',
        '@vueuse/integrations/useFocusTrap',
        'focus-trap',
        'vue-final-modal',
      ],
    },
  },
})
