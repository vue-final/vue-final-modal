export const once
  = (fn: null | ((...args: any[]) => void)) =>
    (...args: any[]) => {
      if (!fn)
        return
      fn?.(...args)
      fn = null
    }

export const noop = () => {}
