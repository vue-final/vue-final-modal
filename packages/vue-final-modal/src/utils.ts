export const once
  = (fn: null | ((...args: any[]) => void)) =>
    (...args: any[]) => {
      if (!fn)
        return
      fn?.(...args)
      fn = null
    }

export const noop = () => {}

export function clamp(val: number, min: number, max: number) {
  return val > max ? max : val < min ? min : val
}

export const isString = (value: unknown): value is string => typeof value === 'string'
