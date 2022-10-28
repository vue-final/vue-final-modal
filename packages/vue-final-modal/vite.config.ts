import path from 'path'
import vueMacros from 'unplugin-vue-macros/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const name = 'index'

export default defineConfig({
  resolve: {
    alias: {
      '~': `${path.resolve(__dirname, 'src')}`,
    },
  },
  plugins: [
    vueMacros({
      plugins: {
        vue: vue(),
      },
    }),
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
  define: {
    __DEV__: JSON.stringify(!process.env.prod),
  },
  test: {
    coverage: {
      reporter: ['text', 'lcov'],
    },
    include: ['test/**/*.test.ts'],
    environment: 'jsdom',
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
