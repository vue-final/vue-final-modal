import { computed } from 'vue'
import { useDark } from '@vueuse/core'
import type { UseDarkOptions } from '@vueuse/core'

export const darkStorageConfig: UseDarkOptions = {
  storageKey: 'pinia-color-scheme',
  valueLight: 'light',
}


export const isDark = useDark(darkStorageConfig)

export const label = computed(() => (isDark.value ? 'Switch to light mode' : 'Switch to dark mode'))
