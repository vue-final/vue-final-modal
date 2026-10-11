import type { InjectionKey } from 'vue'
import { hasInjectionContext, inject } from 'vue'

export const isClient = typeof window !== 'undefined' && typeof document !== 'undefined'

let markedServer = false

/** Call once when a server that defines `window` starts, before it renders: nothing else tells such a server from a browser. */
export function markServer() {
  markedServer = true
}

/** Whether code outside a component runs in a browser: `window` exists and markServer() was not called. */
export function isBrowser() {
  return isClient && !markedServer
}

export interface InstanceResolver<T> {
  resolve: (explicit?: T) => T | undefined
  setActive: (instance: T | undefined) => void
}

export function createInstanceResolver<T>(key: InjectionKey<T>): InstanceResolver<T> {
  let active: T | undefined

  return {
    resolve(explicit) {
      if (explicit)
        return explicit

      if (hasInjectionContext()) {
        const injected = inject(key, null)
        if (injected)
          return injected
      }

      /** The active instance is shared by every concurrent request: on the server it would hand one request's instance to another. */
      return isBrowser() ? active : undefined
    },
    setActive(instance) {
      active = instance
    },
  }
}
