import Theme from 'vitepress/theme'
import { h, nextTick } from 'vue'
import type { FunctionalComponent } from 'vue'
import './sponsors.css'
import { darkStorageConfig } from './dark-theme'
import { useDark } from '@vueuse/core'

export const Layout: FunctionalComponent = () => {
  const isDark = useDark(darkStorageConfig)
  return h(
    Theme.Layout,
    {
      onVnodeMounted() {
        // wait to ticks to fix the problem of SSR with no color scheme
        nextTick(() => {
          isDark.value = !isDark.value
          return nextTick()
        }).then(() => {
          isDark.value = !isDark.value
        })
      },
    },
   
  )
}

Layout.displayName = 'CustomLayout'
